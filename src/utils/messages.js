const generateMessage = (username,text)=>{
    return {username,
        text,
        createdAt:new Date().getTime()
    }

}
const generateLocation = (username,coords)=>{
    return {username,
        location:(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`),
        createdAt:new Date().getTime()
    }
}
module.exports={
    generateMessage,
    generateLocation
}