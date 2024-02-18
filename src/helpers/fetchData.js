const axios = require('axios');
const cheerio = require('cheerio');

// Константа, удаляющая мусорную табуляцию
const textbeautifier = (text) => {
    return text.replace(/\t/g, '').replace(/\n/g, '');
};

/**
 * Получение данных с указанного URL с использованием заданного заголовка User-Agent.
 *
 * @param {string} url - URL-адрес, с которого нужно получить данные
 * @param {string} ua - Заголовок User-Agent
 * @param {number} selectedDay - Выбранный день для сбора данных
 */
async function fetchData(url, ua, selectedDay) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': ua,
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const getCurrentWeek = textbeautifier($("div.vt234").find("span").text());
    console.log(`- Текущая неделя: ${getCurrentWeek}`);

    let subjectIndex = (selectedDay != 1) ? 1 : 0;
    const i = $(`.vt239.rasp-day.rasp-day${selectedDay}`);

    let jsonData = [];
    for (const q of i) {
      const subject = textbeautifier($(q).find(".vt240").text());
      const teacher = textbeautifier($(q).find(".teacher").text());
      const classroom = textbeautifier($(q).find(".vt242").text()).replace("; ", "");
      const type = textbeautifier($(q).find(".vt243").text());

      var data = {
        index: subjectIndex,
        subject: subject,
        teacher: teacher,
        classroom: classroom,
        type: type,
      };

      if (subject.trim() === '') {
        console.log("[!] Найдена пустая строка. Пропускаю");
        continue;
      };
      subjectIndex++;

      jsonData.push(data);
    }

    return jsonData;
  } catch (error) {
    console.error(error);
  }
}

module.exports = fetchData;
