/**
 * @param languages - the list of languages to filter
 * @param item - the state item that include the languages
 * @param index
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 * @Description this method is to filter the languages before send it to the autocomplete
 */
export const getNotSelectedLanguage = (languages, item, index) => (languages || []).filter(
    (element) => Object.keys(item || {}).findIndex(
        (el, itemIndex) => el && el === element.code && index !== itemIndex,
    ) === -1,
);

/**
 * @param languages - the list of languages to filter
 * @param languageCode
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 * @Description this method is to get language title
 */
export const getLanguageTitle = (languages, languageCode) => languages.find((item) => languageCode === item.code)?.title || 'N/A';
