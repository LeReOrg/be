export function generateRandomString(length, {
  includeAlphabet = true,
  includeNumber = true,
}) {
  let result = [];
  let characters = "";

  if (includeAlphabet) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (includeNumber) characters += "0123456789";

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(
        Math.floor(
          Math.random() * charactersLength
        )
      )
    );
  }

  return result.join('');
}