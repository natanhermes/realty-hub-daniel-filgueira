export default async function updatePropertyAction(formData: FormData) {
  const { code, ...data } = Object.fromEntries(formData);

  console.log('code', code)
  console.log('data', data)
}


