import jwt from 'jsonwebtoken'

const SECRET = "IkGjdS3DQytluc6orOxdnCe5xByR4RlHwed06ylaed-rbJD9QWDGlfBvcq2IvVKu"

export const verifyToken = async (token) => {
    if(!token){
        return false
    }

    try{

        const decode = await jwt.verify(token, SECRET)
        return true
    }catch(error){
    console.log(error)
    return false
    }
}

export const decodeToken = async (token) =>{
    if(!verifyToken){
        return false
    }
    const decode = await jwt.verify(token,SECRET)
    return decode
}