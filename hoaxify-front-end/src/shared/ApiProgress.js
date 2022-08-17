import axios from "axios";
import React, { Component, useState, useEffect } from "react";

export const useApiProgress = (apiMethod,apiPath,strictPath) => {
  const [pendingApiCall, setPendingApiCall] = useState(false);

  useEffect(() => {
    let requestInterceptor;
    let responseInterceptor;
    
    const updateApiCallFor = (method,url, inProgress) => {
      if( method !== apiMethod){
        return;
      }
      if(strictPath && url === apiPath){
        setPendingApiCall(inProgress);

      }else if(!strictPath && url.startsWith(apiPath)){
          setPendingApiCall(inProgress);
      }
     
    };
    const registerInterceptors = () => {
      requestInterceptor = axios.interceptors.request.use((request) => {
        const {method,url} =request;
        updateApiCallFor(method,url, true);
        return request;
      });

      responseInterceptor = axios.interceptors.response.use(
        (response) => {
        const {method,url} =response.config;

          updateApiCallFor(method,url, false);

          return response;
        },
        (error) => {
          const {method,url} =error.config;
          updateApiCallFor(method,url, false);

          throw error;
        }
      );
    };
    const unRegistorInterceptors = () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };

    registerInterceptors();

    return function unmount() {
      unRegistorInterceptors();
    };
  },[apiPath,apiMethod,strictPath]);

  return pendingApiCall;
};

function getDisplayName(WrappedComponent) {
  return (
    WrappedComponent.getDisplayName || WrappedComponent.name || "Component"
  );
}

export default function withApiProgress(WrappedComponent, apiPath) {
  return class extends Component {
    static displayName =
      "ApiProgress(" + getDisplayName(WrappedComponent) + ")";
    state = {
      pendingApiCall: false,
    };

    componentDidMount() {
      this.registerInterceptors();
    }
    componentWillUnmount() {
      this.unRegistorInterceptors();
    }

    unRegistorInterceptors = () => {
      axios.interceptors.request.eject(this.requestInterceptor);
      axios.interceptors.response.eject(this.responseInterceptor);
    };

    registerInterceptors = () => {
      this.requestInterceptor = axios.interceptors.request.use((request) => {
        this.updateApiCallFor(request.url, true);
        return request;
      });

      this.responseInterceptor = axios.interceptors.response.use(
        (response) => {
          this.updateApiCallFor(response.config.url, false);

          return response;
        },
        (error) => {
          this.updateApiCallFor(error.config.url, false);

          throw error;
        }
      );
    };

    render() {
      const pendingApiCall =
        this.state.pendingApiCall || this.props.pendingApiCall;

      // <div>
      //   {" "}
      //   {React.cloneElement(this.props.children, { pendingApiCall })}
      // </div>
      return (
        <WrappedComponent {...this.props} pendingApiCall={pendingApiCall} />
      );
    }
  };
}
