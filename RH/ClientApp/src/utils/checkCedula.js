export const isValidCedula = (cedula) => {
  cedula = cedula.replace(/\D/g, "");

  if (cedula.length !== 11) {
    return false;
  }

  let total = 0;
  var length = cedula.length;
  const multiplierDigit = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];

  for (let i = 1; i <= length; i++) {
    let value = parseInt(cedula.charAt(i - 1)) * multiplierDigit[i - 1];
    if (value < 10) {
      total += value;
    } else {
      total += parseInt(value.toString().substring(0, 1)) + parseInt(value.toString().substring(1));
    }
  }

  return total % 10 === 0;
};
