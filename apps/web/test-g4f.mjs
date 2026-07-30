import Client from 'g4f'

async function test() {
  const client = new Client();
  const response = await client.images.generate({
      model: "flux",
      prompt: "a white siamese cat"
  });
  console.log(response.data[0].url);
}

test();
