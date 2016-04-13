app.factory('PostJson',function($http,$q){
   
    //Return public API.
    return({
        postData: postData
        });
    function postData(apiUrl,data,headerData){
        var request = $http({
            method: "POST",
            headers: headerData,            
            url: apiUrl,
            data:data
        });
        return(request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        if (!angular.isObject(response.data) || !response.data.message) {
            return($q.reject(response.data));
        }
        // Otherwise, use expected error message.
        return($q.reject(response.data.message));
    }

    function handleSuccess(response) {
        return(response.data);
    }
  }); 
  
  
app.factory('GetJson', function ($http, $q, $location,$sessionStorage) {

    // Return public API.
    return({
        getData: getData
    });

    function getData(apiUrl)
    {
       var request = $http({
            method: "GET", 
            url: apiUrl,
        })
        return(request.then(handleSuccess, handleError));
    }
        
    function handleError(response) {

        if (!angular.isObject(response.data) || !response.data.message) {
            return($q.reject(response.data));
        }
        // Otherwise, use expected error message.
        return($q.reject(response.data.message));
    }

    function handleSuccess(response) {
        if(response.status == 401){
            $location.path('/'); 
        }
        return(response.data);
    }
});


app.factory('myInterceptor',function($sessionStorage){
    return{
        
       request:function(config)
       {
           config.headers['Authorization'] = $sessionStorage.mansysCloudTokenType+ ' ' + $sessionStorage.mansysCloudAccessToken;
           return config;              
       },
       requestError:function(config)
       {
           return config;
       },
       response:function(res)
       {
           return res;
       },
       responseError:function(res)
       {
           return res;
       }
   }; 
});
