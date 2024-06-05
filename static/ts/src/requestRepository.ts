import { Models } from "./models";
export module RequestRepository{
    export async function getCampaignResult(id : number):Promise<Models.Campaign>{
        let headers = getHeaders();
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
    export async function deleteCampaign(id: number):Promise<void>{
        let headers = getHeaders();
        let request_url = "/campaigns/"+id;
        await fetch(request_url,{
            method:'DELETE',
            headers:headers
        });
    }

    export async function completeCampaign(id:number): Promise<void>{
        let headers = getHeaders();
        let request_url = "/campaigns/"+id+"/complete";
        await fetch(request_url,{
            method: "GET",
            headers:headers
        });
    }
    function getHeaders():Headers{
        let apiKey = localStorage.getItem("api_key");
        let headers = new Headers();
        headers.set("Authorization","Bearer "+apiKey);
        return headers;
    }
}
