// noinspection LongLine

export const numbersExpression = /^[0-9]*$/;
export const phoneExpression = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/gm;
export const faxExpression = /[+? *[1-9]+]?[0-9 ]+/im;
export const onlyEnglishSmall = /^[a-z]*$/m;
export const numericAndAlphabeticalExpression = /^[a-zA-Z0-9]*$/m;
export const numericAndAlphabeticalAndSpecialExpression =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
export const emailExpression =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlExpression = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
export const secureUrlExpression = /^(https):\/\/[^\s$.?#].[^\s]*$/;
export const strongStringRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);
export const mediumStringRegex = new RegExp(
  '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
);
export const isImageType = /\.(gif|jpe?g|tiff?|png|webp|bmp|ico)$/i;
export const youtubeVideoExpression =
  /(https?):\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#!)v=)([\w-]{11}).*/gi;
export const youtubeProfileExpression =
  /(https?:\/\/)?(www\.)?youtube\.com\/(channel|user|c|u)\/[\w-]/gi;
export const youtubeProfileOrVideoExpression =
  /((https?:\/\/)?(www\.)?youtube\.com\/(channel|user|c|u)\/[\w-])|((https?):\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#!)v=)([\w-]{11}).*)/gi;
export const twitterExpression = /(https?:\/\/)?(www\.)?twitter\.com\/[\w-]/gi;
export const snapchatExpression =
  /(?:https?:)?\/\/(?:www\.)?snapchat\.com\/add\/?[A-z0-9._-]+\/?/gi;
export const instagramExpression =
  /(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/?[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|\.(?!\.)){0,28}[A-Za-z0-9_])?/gi;
export const facebookExpression =
  /(?:(https?):\/\/)?(?:www\.)?facebook\.com\/(?:(\w)*#!\/)?(?:pages\/)?(?:[\w-]*\/)*([\w-]*)/gi;
export const linkedinExpression =
  /(?:(https?):\/\/)?(?:www\.)?linkedin\.com\/(?:(\w)*#!\/)?(?:pages\/)?(?:[\w-]*\/)*([\w-]*)/gi;
export const gitHubExpression =
  /(?:(https?):\/\/)?(?:www\.)?github\.intuit\.com\/(?:(\w)*#!\/)?(?:pages\/)?(?:[\w-]*\/)*([\w-]*)/gi;
