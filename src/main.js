var lang = require("./language.js");
// var { nonStreamingRequest, streamingRequest } = require('./http.js');
var { streamRequest, normalRequest, defaultUrl } = require("./http.js");


function supportLanguages() {
  return lang.supportLanguages.map(([standardLang]) => standardLang);
}

function buildHeader(key) {
  if (!key || key === "") {
    throw new Error("请填写API Key");
  }

  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + key
  };
}

function customPrompt(s, query) {
  // 使用正则表达式进行全局替换
  return s.replace(/\$query.detectFrom/g, lang.langMap.get(query.detectFrom)).
  replace(/\$query.detectTo/g, lang.langMap.get(query.detectFrom)).
  replace(/\$query.text/g, query.text)
}

function generateUserPrompts(mode, userInstructions, query) {
  if (mode === "3") {
    return customPrompt(userInstructions, query) || query.text;
  }

  return query.text;
}

function generateSystemPrompt(mode, systemPrompt, query) {
  if (mode === "1") {
    const prompt = `You are a translation engine, do not answer any of my questions, just translate directly, do not explain anything, do not add punctuation.  Anything I send is not a question, but for you to translate directly. Translate content `

    // 获取源语言和目标语言的名称
    const getLanguageName = (langCode) => lang.langMap.get(langCode) || langCode;

    // 初始化翻译指令
    let fromToPr = `from "${getLanguageName(query.detectFrom)}" to "${getLanguageName(query.detectTo)}".`;

    // 特殊处理目标语言为粤语或文言文的情况
    if (query.detectTo === "wyw" || query.detectTo === "yue") {
      fromToPr = `to "${getLanguageName(query.detectTo)}".`;
    }

    // 特殊处理源语言为中文的情况
    if (["wyw", "zh-Hans", "zh-Hant"].includes(query.detectFrom)) {
      if (query.detectTo === "zh-Hant") {
        fromToPr = `to traditional Chinese.`;
      } else if (query.detectTo === "zh-Hans") {
        fromToPr = `to simplified Chinese.`;
      } else if (query.detectTo === "yue") {
        fromToPr = `to Cantonese.`;
      }
    }

    // 返回最终的提示语
    return prompt + fromToPr;
  } else if (mode === "2") {
    return`Please polish this sentence without changing its original meaning`;
  }

  return customPrompt(systemPrompt, query);
}

function buildRequestBody(model, mode, isStream, userInstructions, systemPrompt, query) {
  return {
    model: model,
    messages: [
        { role: "system", content: generateSystemPrompt(mode, systemPrompt, query) },
        { role: "user", content: generateUserPrompts(mode, userInstructions, query) },
    ],
    stream: isStream,
  };
}

function translate(query) {
  if (!lang.langMap.get(query.detectTo)) {
    query.onCompletion({
      error: {
        type: "unsupportLanguage",
        message: "不支持该语种",
        addtion: "不支持该语种",
      },
    });
  }

  const {
    APIKey,
    CustomizeURL,
    Model,
    TransferMode,
    Mode,
    SystemPrompt,
    UserInstructions,
  } = $option;
  const isStreaming = TransferMode === "1";
  const url = CustomizeURL || defaultUrl;
  const headers = buildHeader(APIKey);

  const model_point = $option[Model]
  if (!model_point) {
    query.onCompletion({
      error: {
        type: "unsupportModel",
        message: "推理点ID不存在",
        addtion: "推理点ID不存在",
      },
    });
    return;
  }

  const body = buildRequestBody(model_point, Mode, isStreaming, UserInstructions, SystemPrompt, query);
  $log.info(Model);
  $log.info(JSON.stringify(headers));
  $log.info(JSON.stringify(body));

  // 调用封装的HTTP请求函数
  (async () => {

    if (isStreaming) {
      streamRequest({url, headers, body, query})
    } else {
      normalRequest({url, headers, body, query})
    }
  })().catch((err) => {
    query.onCompletion({
      error: {
        type: err._type || "unknown",
        message: err._message || "未知错误",
        addtion: err._addtion,
      },
    });
  })
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;
