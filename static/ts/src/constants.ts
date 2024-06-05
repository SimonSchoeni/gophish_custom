export module Constants{
    export const AreYouSure: string = "Are you sure?";
    export const DeleteCampaignHeader: string ="This will delete the campaign. This can't be undone!";
    export const TypeWarning:string = "warning";
    export const QuestionType: string = "question";
    export const ErrorType: string ="error";
    export const DeleteCampaignButtonText: string ="Delete Campaign";
    export const CloseButtonText:string ="Close";
    export const ConfirmButtonColor: string ="#428bca";
    export const CampaignDeletedHeader:string ="Campaign Deleted!";
    export const CampaginDeletedMessage:string ="This campaign has been deleted!";
    export const SwalSuccess:string ="success";
    export const StopProcessingCampaign: string = "Gophish will stop processing events for this campaign";
    export const StopCampaignButtonText: string = "Complete Campaign";
    export const CampaignCompletedHeader: string ="Campaign Completed!";
    export const CampaignCompletedMessage: string ="This campaign has been completed!";
    export const ContinueText:string ="Continue";
    export const ErrorText: string ="Error";
    export function reportCampaignMessage(rid:number):string{
        return "This result will be flagged as reported (RID: " + rid + ")";
    } 
}