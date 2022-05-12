/*
TODO:
- Add ReentrancyGuard
- Add Initializer
- Add SafeTransfer
- Add Deployer / Factory / Registry
    - deploy
    - emitERC721Transfered
    - emitERC20Approved
    - emitERC20Transfered
- Write tests
    - initialize
        - assert owners.length == equities.length
        - verify owners & equities are set
    - transfer ETH ?
        - verify tokens received
        - fallback function
    - add acceptedToken
        - assert token is not already added?
    - transfer Token ?
        - verify tokens exist in contract
    - transfer NFT
        - verified transfered
        - verify added to storage for later retreival
        - event emitted
    - has NFT
        - verify list of NFTs matching are returned
    - withdraw
        - verify nonReentrant?
        - verify correct equities sent
        - verify ETH transfered
        - verify all tokens transferd
        - verify added
    - disintegrate
        - selfdestruct? What if tokens exist in contract that are not in acceptedERC20s?
        - verify NFTs returned to their owners
- Frontend
    - UI for creating new Identity
        - Owners + Equity inputs
        - Add AcceptedERC20
        - Transfer ETH
        - Transfer tokens
        - Approve and transfer NFT
        - Input to check hasNFT
        - Withdraw button
        - Disintegrate button
        - Event log

Is it possible to see all tokens in contract?
*/

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Identity is IERC721Receiver, ReentrancyGuard, Initializable {
    address[] private s_owners;
    uint256[] private s_equities;
    address[] private s_acceptedERC20s;

    StoredNFT[] public nfts;

    struct StoredNFT {
        address collection;
        uint256 tokenId;
        uint256 since;
        address owner;
    }

    event WithdrawERC20(
        address indexed token,
        address indexed receiver,
        uint256 amount
    );
    event WithdrawETH(address indexed receiver, uint256 amount);
    event Disintegrate(address indexed account);
    event ERC20Accepted(address indexed token, address indexed account);
    event NFTTransfered(
        address indexed collection,
        uint256 tokenId,
        address indexed account
    );

    error TransferFailed();
    error MustBeOwner();
    error OwnerEquitiesIncorrect();
    error ERC20AlreadyAdded();

    function initialize(
        address[] calldata _owners,
        uint256[] calldata _equities
    ) public initializer {
        if (_owners.length != _equities.length) {
            revert OwnerEquitiesIncorrect();
        }
        uint256 equitiesAmount;
        for (uint256 i = 0; i < _equities.length; i++) {
            equitiesAmount += _equities[i];
        }
        if (equitiesAmount != 100) {
            revert OwnerEquitiesIncorrect();
        }

        s_owners = _owners;
        s_equities = _equities;
    }

    function owners() public view returns (address[] memory) {
        return s_owners;
    }

    function equities() public view returns (uint256[] memory) {
        return s_equities;
    }

    function acceptedERC20s() public view returns (address[] memory) {
        return s_acceptedERC20s;
    }

    receive() external payable {}

    fallback() external payable {}

    /// @notice Transfer NFT to contract. Must be approved first.
    /// @param _collection NFT collection to transfer from
    /// @param _collection NFT tokenId
    function transferNFT(address _collection, uint256 _tokenId)
        public
        onlyOwners
    {
        // Transfer approved NFT to contract
        IERC721(_collection).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            msg.data
        );
        nfts.push(
            StoredNFT(_collection, _tokenId, block.timestamp, msg.sender)
        );

        // registry.emitTransfered(nft);
        emit NFTTransfered(_collection, _tokenId, msg.sender);
    }

    /// @notice Checks if contract has any NFTs in a collection.
    /// @param _collection NFT collection to check
    /// @return tokenId NFT tokenId
    /// @return since NFT transfered to contract
    function hasNFT(address _collection)
        external
        view
        returns (uint256 tokenId, uint256 since)
    {
        StoredNFT[] memory _nfts = nfts;

        for (uint256 i = 0; i < _nfts.length; i++) {
            if (_nfts[i].collection == _collection) {
                // What if many tokens from same collection?
                return (_nfts[i].tokenId, _nfts[i].since);
            }
        }
    }

    /// @notice Add ERC20 token to accepted tokens.
    /// @dev Can only be called by owners.
    /// @param _token token address to add to list
    function acceptERC20(address _token) public {
        // Check if token exists in array first
        address[] memory _existing = acceptedERC20s();
        for (uint256 i = 0; i < _existing.length; i++) {
            if (_existing[i] == _token) {
                revert ERC20AlreadyAdded();
            }
        }
        s_acceptedERC20s.push(_token);
        emit ERC20Accepted(_token, msg.sender);
    }

    /// @notice Withdraws all tokens and ETH sent to contract. Distributed according to `equities`.
    /// @dev Can only be called by owners.
    function withdraw() public nonReentrant onlyOwners {
        address[] memory _tokens = acceptedERC20s();
        address[] memory _owners = owners();
        uint256[] memory _equities = equities();

        // Withdraw ERC20 tokens
        for (uint256 i = 0; i < _tokens.length; i++) {
            uint256 _balance = IERC20(_tokens[i]).balanceOf(address(this));

            for (uint256 j = 0; j < _owners.length; j++) {
                uint256 _equity = _equities[j];
                uint256 _amount = (_balance * _equity) / 100;
                // Send tokens to each owner
                SafeERC20.safeTransfer(IERC20(_tokens[i]), _owners[j], _amount);

                emit WithdrawERC20(_tokens[i], _owners[j], _amount);
            }
        }

        // Withdraw ETH
        uint256 _ethBalance = address(this).balance;
        for (uint256 i = 0; i < _owners.length; i++) {
            uint256 _equity = _equities[i];
            uint256 _amount = (_ethBalance * _equity) / 100;
            // Send eth to each owner
            (bool sent, ) = payable(_owners[i]).call{value: _amount}("");

            if (!sent) {
                revert TransferFailed();
            }
            emit WithdrawETH(_owners[i], _amount);
        }
    }

    /// @notice Disintegrate contract and return assets to all owners.
    /// @dev Can only be called by owners.
    function disintegrate() public onlyOwners {
        _disintegrateInit();
        _disintegrateFinalize();

        emit Disintegrate(msg.sender);

        // Should this be selfdestructed? What if unclaimed ERC20 tokens are in it?
    }

    function _disintegrateInit() internal {
        withdraw();
    }

    function _disintegrateFinalize() internal {
        // Return all NFTs to their owners
        StoredNFT[] memory _nfts = nfts;
        for (uint256 i = 0; i < _nfts.length; i++) {
            IERC721(_nfts[i].collection).safeTransferFrom(
                address(this),
                _nfts[i].owner,
                _nfts[i].tokenId
            );
        }
    }

    modifier onlyOwners() {
        address[] memory _owners = owners();
        bool isOwner = false;

        for (uint256 i = 0; i < _owners.length; i++) {
            if (_owners[i] == msg.sender) {
                isOwner = true;
            }
        }
        if (!isOwner) {
            revert MustBeOwner();
        }
        _;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
