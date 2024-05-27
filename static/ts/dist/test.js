import { test } from "./test2.js";
import { RequestRepository } from "./requestRepository.js";
import $ from 'jquery';
global.jQuery = $;
$("testing").text("ABCBCBCBCBC");
//document.getElementById("testing").innerHTML = "BBB";
RequestRepository.getCampaignResult(133);
let cc = new test.exportedFile();
console.log(cc.sayHello());
