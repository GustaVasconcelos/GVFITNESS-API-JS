import express from 'express'
import userController from './controllers/user.controller.js'

const Routes = express.Router()
Routes.get('/', userController.index)
Routes.get('/api/usuarios', userController.getUsers)
Routes.get('/api/usuario', userController.getUser)
Routes.post('/api/cadastro_usuario', userController.register)
Routes.post('/api/deletar_usuario',userController.removeUser)
Routes.post('/api/pagamento', userController.updateMonthlyPayment)
Routes.post('/api/login', userController.login)
Routes.get('/api/checktoken', userController.checktoken)
Routes.get('/api/destroytoken', userController.destroytoken)
Routes.patch('/api/adicionar_treino', userController.updateUserTrainingSheet)
Routes.patch('/api/deletar_treino', userController.removeUserTrainingSheet)
Routes.patch('/api/adicionar_detalhe', userController.updateUserDetails)

export default Routes