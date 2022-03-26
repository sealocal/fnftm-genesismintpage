// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let isAllowListMintEnabled = await store
        .getState()
        .blockchain.smartContract.methods.isAllowListMintEnabled()
        .call();
      let isPresaleMintEnabled = await store
        .getState()
        .blockchain.smartContract.methods.isPresaleMintEnabled()
        .call();
      let isPublicMintEnabled = await store
        .getState()
        .blockchain.smartContract.methods.isPublicMintEnabled()
        .call();
      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();

      dispatch(
        fetchDataSuccess({
          totalSupply,
          isAllowListMintEnabled,
          isPresaleMintEnabled,
          isPublicMintEnabled,
          // cost,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
