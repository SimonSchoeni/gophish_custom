var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Models } from "./models.js";
export var RequestRepository;
(function (RequestRepository) {
    function getCampaignResult(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiKey = localStorage.getItem("api_key");
            let headers = new Headers();
            headers.set("Authorization", "Bearer " + apiKey);
            let request_url = "/api/campaigns/" + id + "/results?{}=";
            let result = yield fetch(request_url, {
                method: 'GET',
                headers: headers
            });
            let responseJson = yield result.json();
            console.log(responseJson);
            let campaign = new Models.Campaign().fromResponse(responseJson);
            console.log(campaign);
            return new Models.Campaign();
        });
    }
    RequestRepository.getCampaignResult = getCampaignResult;
})(RequestRepository || (RequestRepository = {}));
