public with sharing class TransactionsController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> retriveTransactions(String receiptNum){
        HttpRequest httpRequest = new HttpRequest();
        String url = 'https://run.mocky.io/v3/f0b3fc38-f9d2-4ea1-874c-35230b6ccad5/' + '?c__receiptNum=' + receiptNum;
        httpRequest.setEndpoint(url);
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
            httpRequest.setEndpoint('https://run.mocky.io/v3/f0b3fc38-f9d2-4ea1-874c-35230b6ccad5');
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