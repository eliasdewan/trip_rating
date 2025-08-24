import { CalculatedDataType } from "../api/rideSharing/common/score";

export function modernHtml(requestData: Array<{ data: string }>, resultData: Array<{ data: string }>) {

  let parsedRequestData = requestData.map(item => JSON.parse(item.data));
  // let parsedResultData: CalculatedDataType[] = resultData.map(item => JSON.parse(item.data));
  let parsedResultData = resultData.map(item => JSON.parse(item.data));
  // console.log(parsedRequestData, "🐱", parsedResultData);

  let resultHtml = "";
  parsedResultData.forEach((result, index) => {
    if (!result) return;

    const {
      pay,
      miles,
      timeMinutes,
      pricePerHour,
      destinationInfoString,
      timeSummary,
      googleApiParameters,
    } = result;

    const collapsedId = `collapsed-${index}`;
    const expandedId = `expanded-${index}`;

    if (!resultHtml) resultHtml = '';
    resultHtml += `
      <div style="border:1px solid #eee; border-radius:10px; margin:10px 0; background:#fafbfc; box-shadow:0 2px 8px #0001;">
        <div style="padding:16px; display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:1.2em; font-weight:600; color:#222;">
            £${pay?.toFixed(2) ?? '-'} &middot; ${miles?.toFixed(2) ?? '-'} mi &middot; ${timeMinutes?.toFixed(0) ?? '-'} min
          </div>
          <div style="font-size:1em; color:#444;">
            <span style="font-weight:500;">£/hr:</span> ${pricePerHour?.toFixed(2) ?? '-'}
          </div>
          <div style="font-size:0.95em; color:#666;">
            <span style="font-weight:500;">From:</span> ${googleApiParameters?.origin ?? '-'}
          </div>
          <div style="font-size:0.95em; color:#666;">
            <span style="font-weight:500;">To:</span> ${googleApiParameters?.destination ?? '-'}
          </div>
          <div style="font-size:0.95em; color:#666;">
            <span style="font-weight:500;">Dest Info:</span> ${destinationInfoString ?? '-'}
          </div>
          <div style="font-size:0.95em; color:#666;">
            <span style="font-weight:500;">Time:</span> ${timeSummary ?? '-'}
          </div>
          <button onclick="document.getElementById('${expandedId}').style.display = (document.getElementById('${expandedId}').style.display === 'none' ? 'block' : 'none')" style="margin-top:8px; padding:8px 12px; border:none; background:#007aff; color:#fff; border-radius:6px; font-size:1em;">
            Show Details
          </button>
          <div id="${expandedId}" style="display:none; margin-top:10px; background:#f5f7fa; border-radius:8px; padding:10px; font-size:0.95em; word-break:break-all;">
            <pre style="white-space:pre-wrap; font-size:0.95em; margin:0;">${JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      </div>
    `;
    console.log(result, "🐶", parsedRequestData[index]);
    return
  });
  return resultHtml;
}