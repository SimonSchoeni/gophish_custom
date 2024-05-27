import { Models } from "./models";
export module RequestRepository{
    export async function getCampaignResult(id : number):Promise<Models.Campaign>{
        let apiKey = localStorage.getItem("api_key");

        let headers = new Headers();
        headers.set("Authorization","Bearer "+apiKey);
        let request_url = "/api/campaigns/"+id+"/results?{}=";
        let result = await fetch(request_url,{
            method: 'GET',
            headers: headers
        });
        let responseJson = await result.json();
        console.log(responseJson);

        let campaign = new Models.Campaign().fromResponse(responseJson);
        console.log(campaign);
        
        
        return new Models.Campaign();
    }
}