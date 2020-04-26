import { useEffect, useState } from "react";
import Http from "./Http";
import { __useFetchContext } from "./Provider";
import {
  IUseFetchInitialState,
  IUseFetchProps,
  IUseFetchReturn,
} from "./types";
import { beforeService, errorMessage, getAccessToken } from "./utilities";

/**
 * useFetch Guidelines 🎉
 *  - This is a react custom hook, so make sure it written in functional component
 *  - Your api should always return object
 *  otherwise it will try to convert your api response into object(kinda crazy) 🔴
 *
 * useFetch Params 👇
 * @param  {string} url - The request URL
 * @param  {('get' | 'delete' | 'post' | 'put')} method - (optional, default 'get') The request method
 * @param  {object} mockData - This is default data for typescript types and api mocking
 * @param  {() => boolean | boolean} [shouldDispatch] - (optional) The conditions for auto run the service(on `componentDidMount` or `[]` in hooks way), it partially depend on `dependencies` arg
 * @param  {boolean} [cancelable] - (optional) should cancel previous request..
 * @param  {boolean} [cache] - (optional) should cache your `GET` request or should reuse the cached version of your pre. request. it uses `In Memory Caching`, it does not use any kinda web storage
 * @param  {boolean} [shouldUseAuthToken] - (optional, default true) if it is true it will send your authorizationToken with the request.
 * @param  {Array<any>} [dependencies] - (optional) This is dependencies array, if any of dependency get update them the service will re-call(on componentDidUpdate, or `[dependencies]` hooks way)
 * @param  {() => void} [beforeServiceCall] - (optional) This function will trigger when the api call trigger
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param @deprecated {string} [serviceName=unknown] - (optional) You can pass name to your service
 */
export const __useFetch = <
  S extends Record<string, any>,
  P extends Record<string, any> = any
>(
  props: IUseFetchProps<S> | string
): IUseFetchReturn<S, P> => {
  const {
    url,
    method = "get",
    mockData = undefined,
    shouldDispatch = undefined,
    cancelable = false,
    cache = false,
    shouldUseAuthToken = true,
    dependencies = undefined,
    beforeServiceCall = undefined,
    options = {},
  } = typeof props === "string" ? { url: props } : props;

  // get access token from UseFetch Context
  const {
    authorizationToken,
    HttpService,
    doesProviderAdded,
    cacheStore,
    updateCache,
  } = __useFetchContext();

  // create http instance
  const httpService = cancelable
    ? Http.Cancelable(HttpService[method])
    : HttpService[method];

  // check if UseFetchProvider is added before use of useFetch
  if (!doesProviderAdded)
    throw new Error(
      "You must wrap your higher level(parent) component with UseFetchProvider, before using useFetch 😬"
    );

  let access_token = getAccessToken(authorizationToken);

  // handle undefined params
  const depends = dependencies || [];
  const isMocked = !!mockData;
  const requireAccessToken = shouldUseAuthToken ? access_token : null;
  const cacheable = method === "get" && cache;

  // initiate state
  const initialState = {
    data: mockData,
    status: {
      isPending: false,
      isRejected: false,
      isFulfilled: false,
      isCached: false,
      isMocked,
      err: "",
    },
  };

  // create store
  const [state, setState] = useState<IUseFetchInitialState<S>>(initialState);

  // cache mutation
  const _updateCache = (cb: (pre: S) => S) => {
    const updatedData = cb(cacheStore[url]["data"]);
    updateCache(url, {
      data: updatedData,
      status: {
        ...initialState.status,
        isCached: true,
        isMocked: false,
        isFulfilled: true,
      },
    });
  };

  // actual service
  const service = (data?: P) => {
    beforeService(beforeServiceCall);
    // pending state
    setState({
      data: state.data ? state.data : undefined,
      status: {
        isFulfilled: false,
        isPending: true,
        isRejected: false,
        isCached: false,
        isMocked,
        err: "",
      },
    });

    // get cache
    if (cacheable) {
      const CachedState: IUseFetchInitialState<S> = cacheStore[url];
      if (CachedState) {
        return setState({
          ...CachedState,
          status: {
            ...CachedState.status,
            isMocked: false,
            isFulfilled: true,
            isCached: true,
          },
        });
      }
    }

    // call service
    httpService?.(url, requireAccessToken, data, options)
      .then(({ data }: any) => {
        // Fulfilled state
        const FulfilledState = {
          data,
          status: {
            isFulfilled: true,
            isPending: false,
            isRejected: false,
            isMocked: false,
            isCached: false,
            err: "",
          },
        };

        setState({ ...FulfilledState });

        // set cache
        if (cacheable) {
          updateCache(url, FulfilledState);
        }
      })
      .catch((err: any) => {
        // Rejected state
        setState({
          data: state.data,
          status: {
            isFulfilled: false,
            isPending: false,
            isCached: false,
            isRejected: true,
            isMocked,
            err: errorMessage(err),
          },
        });
      });
  };

  // service manager
  useEffect(() => {
    if (shouldDispatch) {
      if (typeof shouldDispatch === "function" && shouldDispatch()) {
        service(); // if `shouldDispatch` is a function and it return true
      } else if (typeof shouldDispatch === "boolean" && shouldDispatch) {
        service(); // if `shouldDispatch` is a boolean and it's value is true
      }
    } else if (typeof shouldDispatch === "undefined") {
      if (typeof dependencies !== "undefined") {
        service(); // if `shouldDispatch` is a not given but dependencies has at least one value || not undefiled
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...depends]);

  return [state, service, cacheable ? _updateCache : undefined];
};
