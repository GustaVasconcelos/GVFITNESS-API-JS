import Users from '../model/Users.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import moment from 'moment'

export default{
    async index(req,res){
        return res.status(200).json({msg:"Api conectada"})
    },
    async register(req,res){
        try{
            const {

                username,
                password,
                passwordConfirm,
                typeUser

            } = req.body

            if(!username || !password || !password ||!passwordConfirm || !typeUser){
                return res.status(200).json({msg:"Há campos vázios"})
            }
    
            if(password.length < 6){
                return res.status(200).json({msg:"As senhas tem que ter no minimo 6 digitos"})
            }
            if(password !== passwordConfirm){
                return res.status(200).json({msg:"As senhas são diferentes"})
            }
            

            const details ={
                sex:"Sem valores",
                age:"Sem valores",
                height:"Sem valores",
                weight:"Sem valores",
                imc:"Sem valores",
                torsoMeasurements:{
                    waist:"Sem valores",
                    hip:"Sem valores",
                    abdomen:"Sem valores",
                    chest:"Sem valores"
                },
                upperLimbs:{
                    rightArm:"Sem valores",
                    leftArm:"Sem valores",
                    leftForearm:"Sem valores",
                    rightForearm:"Sem valores"
                },
                lowerMembers:{
                    rightLeg:"Sem valores",
                    leftLeg:"Sem valores",
                    leftCalf:"Sem valores",
                    rightCalf:"Sem valores"
                },
                bodyFat:"Sem valores"  
            }
            

            let user = await Users.findOne({username})
    
            if(!user){
                let monthlyPayment = new Date()
                monthlyPayment = moment(monthlyPayment).add(1,'months').format()
                
                let data = {username,password,typeUser,monthlyPayment,details}
                console.log(data)
                user = await Users.create(data)
    
                return res.status(201).json({msg:"Usuário foi registrado"})
    
            }else{
                return res.status(200).json({msg:"Usuário já está sendo utilizado"})
            }
        }catch(err){
            console.log(err)
        }

    },
    async removeUser(req,res){

        const {username} = req.body

        const user = await Users.findOneAndDelete({username})

        return res.status(200).json({msg:"Usuário removido"})
    },
    async getUsers(req,res){
        try{
            const UsersDb = await Users.find()

            if(UsersDb.length === 0){
                return res.status(400).json({msg:"Não há usuários cadastrado"})
            }
    
            return res.status(200).json(UsersDb)
        }catch(err){
            console.log(err)
        }

    },
    async getUser(req,res){

        try{

            const username = req.headers.username
            if(!username){
                return res.status(200).json({status:2,msg:"Há campos vázios"})
            }
            const User = await Users.findOne({username})
    
            if(!User){
                return res.status(200).json({status:2,msg:"Usuário não encontrado"})
            }else{
                return res.status(201).json(User)
            }
        }catch(err){
            console.log(err)
        }
        
        
    },
    async updateMonthlyPayment(req,res){
        const {username} = req.body
        
        const user = await Users.findOne({username})
        
        let monthlyPayment = user.monthlyPayment
        monthlyPayment = moment(monthlyPayment).add(1,'months').format()
        
        await Users.updateOne({username},{$set:{monthlyPayment}})

        return res.status(200).json(user)
        
        
    },
    async updateUserTrainingSheet(req,res){
        try{
            const {
                username,
                training,
                exercise,
                member,
                repetitions
            } = req.body
            const idexercise = Math.floor(Date.now() * Math.random()).toString()

            if(!training || !exercise || !member || !repetitions){
                return res.status(200).json({msg:"Há campos vázios!"})
            }
            let user = await Users.findOne({username})
    
            if(!user){
                return res.status(400).json({msg:"Usuário não encontrado"})
            }else{
                if(training === 1){
                    user = await Users.findOneAndUpdate({username},{$push:{trainingSheetOne:{idexercise,training,exercise,member,repetitions}}},{new:true})
                }else if(training === 2){
                    user = await Users.findOneAndUpdate({username},{$push:{trainingSheetTwo:{idexercise,training,exercise,member,repetitions}}},{new:true})
                }else if(training === 3){
                    user = await Users.findOneAndUpdate({username},{$push:{trainingSheetThree:{idexercise,training,exercise,member,repetitions}}},{new:true})
                }else{
                    user = await Users.findOneAndUpdate({username},{$push:{trainingSheetFour:{idexercise,training,exercise,member,repetitions}}},{new:true})
                }


                return res.status(200).json({msg:"Exércicio foi adicionado!"})
            }
        }catch(err){
            console.log(err)
        }

    },
    async removeUserTrainingSheet(req,res){
        try{
            const {
                username,
                training,
                idexercise
            } = req.body

            if(!idexercise){
                return res.status(400).json({msg:"Há campos vázios"})
            }
            let user = await Users.findOne({username})
    
            if(!user){
                return res.status(400).json({msg:"Usuário não encontrado"})
            }else{
                
                if(training === 1){
                    user = await Users.findOneAndUpdate({username},{$pull:{trainingSheetOne:{idexercise}}},{new:true})
                }else if(training === 2){
                    user = await Users.findOneAndUpdate({username},{$pull:{trainingSheetTwo:{idexercise}}},{new:true})
                }else if(training === 3){
                    user = await Users.findOneAndUpdate({username},{$pull:{trainingSheetThree:{idexercise}}},{new:true})
                }else{
                    user = await Users.findOneAndUpdate({username},{$pull:{trainingSheetFour:{idexercise}}},{new:true})
                }
                
    
                return res.status(200).json({msg:"Exércicio foi removido!"})
            }
        }catch(err){
            console.log(err)
        }

    },
    async updateUserDetails(req,res){
        try{
            let {
                
                username,
                sex,
                age,
                weight,
                height,
                hip,
                waist,
                chest,
                abdomen,
                rightArm,
                rightForearm,
                leftArm,
                leftForearm,
                rightLeg,
                rightCalf,
                leftLeg,
                leftCalf

            } = req.body
            
    
            let user = await Users.findOne({username})
    
            if(!user){
                return res.status(200).json({status:2,msg:"Usuário não encontrado"})
            }else{

                if(!sex || sex === undefined){
                    if(user.details[0].sex !== null){
                        sex = user.details[0].sex
                    }else{
                        sex = 'Sem valores'
                    }
                }
                
                if(!age || age === undefined ){
                    if(user.details[0].age !== null){
                        age = user.details[0].age
                    }else{
                        age = 'Sem valores'
                    }
                }

                if(!weight || weight === undefined){
                    if(user.details[0].weight !== null){
                        weight = user.details[0].weight
                    }else{
                        weight = 'Sem valores'
                    }
                }

                if(!height || height === undefined){
                    if(user.details[0].height !== null){
                        height = user.details[0].height
                    }else{
                        height = 'Sem valores'
                    }
                }

                if(!hip || hip === undefined){
                    if(user.details[0].torsoMeasurements.hip !== null){
                        hip = user.details[0].torsoMeasurements.hip
                    }else{
                        hip = 'Sem valores'
                    }
                }

                if(!waist || waist === undefined){
                    if(user.details[0].torsoMeasurements.waist !== null){
                        waist = user.details[0].torsoMeasurements.waist
                    }else{
                        waist = 'Sem valores'
                    }
                }

                if(!chest || chest === undefined){
                    if(user.details[0].torsoMeasurements.chest !== null){
                        chest = user.details[0].torsoMeasurements.chest
                    }else{
                        chest = 'Sem valores'
                    }
                }

                if(!abdomen || abdomen === undefined){
                    if(user.details[0].torsoMeasurements.abdomen !== null){
                        abdomen = user.details[0].torsoMeasurements.abdomen
                    }else{
                        abdomen = 'Sem valores'
                    } 
                }

                if(!rightArm || rightArm === undefined){
                    if(user.details[0].upperLimbs.rightArm !== null){
                        rightArm = user.details[0].upperLimbs.rightArm
                    }else{
                        rightArm = 'Sem valores'
                    } 
                }

                if(!rightForearm || rightForearm === undefined){
                    if(user.details[0].upperLimbs.rightForearm !== null){
                        rightForearm = user.details[0].upperLimbs.rightForearm
                    }else{
                        rightForearm = 'Sem valores'
                    } 
                }

                if(!leftArm ||leftArm === undefined){
                    if(user.details[0].upperLimbs.leftArm !== null){
                        leftArm = user.details[0].upperLimbs.leftArm
                    }else{
                        leftArm = 'Sem valores'
                    } 
                }

                if(!leftForearm ||leftForearm === undefined){
                    if(user.details[0].upperLimbs.leftForearm !== null){
                        leftForearm = user.details[0].upperLimbs.leftForearm
                    }else{
                        leftForearm = 'Sem valores'
                    } 
                }
                
                if(!leftLeg ||leftLeg === undefined){
                    if(user.details[0].lowerMembers.leftLeg !== null){
                        leftLeg = user.details[0].lowerMembers.leftLeg
                    }else{
                        leftLeg = 'Sem valores'
                    } 
                }

                if(!leftCalf || leftCalf === undefined){
                    if(user.details[0].lowerMembers.leftCalf !== null){
                        leftCalf = user.details[0].lowerMembers.leftCalf
                    }else{
                        leftCalf = 'Sem valores'
                    } 
                }

                if(!rightLeg || rightLeg === undefined){
                    if(user.details[0].lowerMembers.rightLeg !== null){
                        rightLeg = user.details[0].lowerMembers.rightLeg
                    }else{
                        rightLeg = 'Sem valores'
                    } 
                }

                if(!rightCalf || rightCalf === undefined){
                    if(user.details[0].lowerMembers.rightCalf !== null){
                        rightCalf = user.details[0].lowerMembers.rightCalf
                    }else{
                        rightCalf = 'Sem valores'
                    } 
                }

                let imc;

                if(height === "Sem valores" || weight === "Sem valores"){

                    imc = 'Sem valores'

                }else{

                    imc = weight/(height * height)
                    imc = parseFloat(imc.toFixed(2))

                }

                let bodyFat;

                if(imc !== 'Sem valores' && age !== 'Sem valores' && sex !== 'Sem valores'){

                    if(sex === 'M'){
                        
                        bodyFat = (1.20*imc) + (0.23 * age) - (10.8 * 1) - 5.4
                        bodyFat = parseFloat(bodyFat.toFixed(2))

                    }else{
                        bodyFat = (1.20*imc) + (0.23 * age) - (10.8 * 0) - 5.4
                        bodyFat = parseFloat(bodyFat.toFixed(2))
                    }
                }else{

                    bodyFat = 'Sem valores'
                }

                await Users.updateOne({username},{details:{

                    sex,
                    age,
                    height,
                    weight,
                    imc,
                    torsoMeasurements:{
                        waist,
                        hip,
                        abdomen,
                        chest
                    },
                    upperLimbs:{
                        rightArm,
                        leftArm,
                        leftForearm,
                        rightForearm
                    },
                    lowerMembers:{
                        rightLeg,
                        leftLeg,
                        leftCalf,
                        rightCalf
                    },
                    bodyFat      
                    },
                },
                {new:true})
    
                return res.status(200).json({status:1,msg:"detalhes foi adicionado!"})
                
            }
        }catch(err){
            console.log(err)
        }

    },
    async login(req,res){
        
            const {username,password} = req.body
            if(!username || !password){
                return res.status(200).json({status:2,msg:"Há campos vazios!!"})
            }
            
            const user = await Users.findOne({username:username})
            if(!user){
                return res.status(200).json({status:2,msg:"Usuário ou Senha incorreta!"})
            }

            const passwordIsValid = bcrypt.compareSync(password,user.password)
            
            if (!passwordIsValid) {
                return res.status(200).send({status:2, msg: "Usuário ou Senha incorreta!" });
              }

            const token = jwt.sign({username},process.env.SECRET_JWT,{expiresIn:86400})

            res.cookie("token",token,{httpOnly:true})
            res.status(200).json({status:1,auth:true,token:token,id_client:user._id,username:user.username,typeUser:user.typeUser})
        },
    async checktoken (req,res){
        const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];

        req.token = token

        if(!token){
            return res.status(401).json({msg:"Token inválido"})
        }else{
            jwt.verify(token,process.env.SECRET_JWT,(err,decoded) =>{
                if(err){
                    return res.status(401).json({msg:"Token inválido"})
                }else{
                    req.username = decoded.username
                    return res.status(200).json({msg:"Token válido"})
                }
            })
        }
    },
    async destroytoken(req,res){
        
        const token = req.headers.token

        if(token){
            res.cookie('token',null,{httpOnly:true})
        }else{
            res.status(401).json({message:"Logout não autorizado"})
        }

        res.send("Sessão finalizada com sucesso")
    },
}