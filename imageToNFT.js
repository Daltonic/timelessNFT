const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { faker } = require('@faker-js/faker')
const dir = 'C:/Users/gospel/Videos/Tutorials/Solidity/nft'

let img_counter = 1
const img_size = { width: 500, height: 500 }
const desired_ext = '.webp'

function genTitle() {
  return `${faker.music.genre()} ${faker.helpers.userCard().company.name} NFT`
}

function genDescription() {
  return `${faker.helpers.userCard().company.bs} with this NFT, created for ${
    faker.helpers.userCard().company.catchPhrase
  }, at ${Object.values(faker.helpers.userCard().address)
    .join(', ')
    .replace(', [object Object]', '')}, and uploaded by ${
    faker.helpers.userCard().name
  }.`
}

function genPrice() {
  return faker.commerce.price(0.01, 3.5, 2)
}

fs.readdirSync(dir).forEach((file) => {
  const original_ext = path.extname(file)
  const original_file_name = path.basename(file).split('.')[0]

  if (['.jpg', '.jpeg', '.png', '.gif'].includes(original_ext)) {
    const image = img_counter + desired_ext
    const id = img_counter

    const meta = {
      title: genTitle(),
      description: genDescription(),
      price: genPrice(),
      image,
      id,
    }

    if (fs.existsSync(`${dir}/${original_file_name + original_ext}`)) {
      sharp(`${dir}/${original_file_name + original_ext}`)
        .resize(img_size.height, img_size.width)
        .toFile(`${dir}/output/${img_counter + desired_ext}`, (err, info) =>
          console.log(err)
        )

      fs.writeFileSync(
        `${dir}/output/${img_counter}.json`,
        JSON.stringify(meta),
        {
          encoding: 'utf8',
          flag: 'w',
        }
      )

      console.log(`${dir}/${img_counter + desired_ext}`)
      img_counter += 1
    }
  }
})
console.log('Completed!')
