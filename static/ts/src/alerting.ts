import { Constants } from "./constants";

declare var swal: any;
export module Alerting{
    export class AlertDefinition{
        type: string = "warning";
        text: string = "";
        title: string = "";
        buttonText: string= "";
        continueButtonColor = Constants.ConfirmButtonColor;
        callBack: (result: any) => void = (x)=>{};
        preConfirm: () => void = () => {};
    }
    export function alert(alertOptions: AlertDefinition){
        swal.fire({
            title: alertOptions.title,
            text: alertOptions.text,
            type: alertOptions.type,
            animation: false,
            showCancelButton: true,
            confirmButtonText: alertOptions.buttonText,
            confirmButtonColor: alertOptions.continueButtonColor,
            reverseButtons: true,
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            preConfirm: alertOptions.preConfirm
        }).then(function (result: any) {
            alertOptions.callBack(result);
        })
    }
    export function showSmallAlert(def: AlertDefinition){
        swal.fire({
            title:def.title,
            text: def.text,
            type: def.type,
            confirmButtonText: def.continueButtonColor
        });
    }
}