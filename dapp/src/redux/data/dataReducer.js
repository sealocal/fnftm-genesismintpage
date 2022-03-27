const initialState = {
  loading: false,
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        isAllowListMintEnabled: action.payload.isAllowListMintEnabled,
        isPresaleMintEnabled: action.payload.isPresaleMintEnabled,
        isPublicMintEnabled: action.payload.isPublicMintEnabled,
        balance: action.payload.balance,
        allowListAllocation: action.payload.allowListAllocation,
        presaleListAllocation: action.payload.presaleListAllocation,
        // cost: action.payload.cost,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
