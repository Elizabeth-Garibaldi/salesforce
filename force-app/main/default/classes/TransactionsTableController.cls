public with sharing class TransactionsTableController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> retriveTransactions(){
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setEndpoint('https://run.mocky.io/v3/f2ce95a8-26ad-456d-be87-846d0129a09e');
        httpRequest.setMethod('GET');

        Map<String, Object> newsJsonData = new Map<String, Object>();
        String strResponse = null;

        try {
            Http http = new Http();
            HttpResponse httpResponse = http.send(httpRequest);
            if (httpResponse.getStatusCode() == 200) {
                strResponse = httpResponse.getBody();
            } else {
                throw new CalloutException(httpResponse.getBody());
            }
        
        } catch (Exception ex) {
            throw ex;
        }

        if(!String.isBlank(strResponse)) {
            newsJsonData = (Map<String, Object> )JSON.deserializeUntyped(strResponse);
        } 
        if(!newsJsonData.isEmpty()) {
            return newsJsonData;
        } else {
            return null;
        }
    }

    @AuraEnabled
        public static Map<String, Object> retriveTxn(){
            HttpRequest httpRequest = new HttpRequest();
            httpRequest.setEndpoint('https://run.mocky.io/v3/e07f0501-53eb-456f-935b-7c2e5c97aedd');
            httpRequest.setMethod('GET');
    
            Map<String, Object> txnJsonData = new Map<String, Object>();
            String strResponse = null;
    
            try{
                Http http = new Http();
                HttpResponse httpResponse = http.send(httpRequest);
                if(httpResponse.getStatusCode() == 200){
                    strResponse = httpResponse.getBody();
                } else {
                    throw new CalloutException(httpResponse.getBody());
                }
    
            } catch(Exception ex){
                throw ex;
            }
    
            if(!String.isBlank(strResponse)){
                txnJsonData = (Map<String, Object>)JSON.deserializeUntyped(strResponse);
            }
            if(!txnJsonData.isEmpty()){
                return txnJsonData;
            } else {
                return null;
            }
        }
}