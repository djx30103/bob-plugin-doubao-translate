var utils = require("./utils.js");

const defaultUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
const streamRequest = async ({ url, headers, body, query }) => {
    let resultText = "";
    return $http.streamRequest({
        method: "POST",
        url: url,
        header: headers,
        body: body,
        streamHandler: (stream) => {

            let streamText = stream.text;
            const dataReg = /^data: /gm;
            const doneReg = /\s*\[DONE\]\s*/;

            // 使用正则表达式将 streamText 按 "data: " 分割为多个块
            const dataBlocks = streamText.split(dataReg);

            dataBlocks.forEach((block) => {
                // 去除首尾空格和换行符
                block = block.trim();

                // 检测和移除 [DONE] 标记
                if (doneReg.test(block)) {
                    block = block.replace(doneReg, '');
                }


                // 忽略空块
                if (block === "") {
                    return;
                }

                const resultJson = JSON.parse(block);
                resultText += resultJson.choices[0].delta.content;
                query.onStream({ result: { toParagraphs: [resultText] } });
            });
        },
        handler: (result) => {
            if (result.response.statusCode >= 400) {
                utils.handleError(query.onCompletion, result);
            } else {
                query.onCompletion({ result: { toParagraphs: [resultText]} });
            }
        },
    });
};

const normalRequest = async ({ url, headers, body , query}) => {
    return $http.request({
        method: "POST",
        url: url,
        header: headers,
        body: body,
        handler: (result) => {
            if (result.response.statusCode >= 400) {
                utils.handleError(query.onCompletion, result);
            } else {
                const data = result.data;
                $log.info(JSON.stringify(data));
                query.onCompletion({ result: { toParagraphs: [data.choices[0].message.content] } });
            }
        },
    });
};

exports.streamRequest = streamRequest;
exports.normalRequest = normalRequest;
exports.defaultUrl = defaultUrl;
