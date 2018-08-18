export function getName(lastName, firstName) {
  if (lastName && firstName) {
    return `${lastName} ${firstName}`;
  } else if (lastName) {
    return lastName;
  }

  return firstName;
}