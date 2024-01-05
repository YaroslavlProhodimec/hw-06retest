import bcrypt from "bcrypt";


const run = async () => {
    const hash = await bcrypt.hash('12345',"$2a$10$r3ZkRK.LvdRbbW26VFzZ8.")
    console.log(hash)
}

run()

