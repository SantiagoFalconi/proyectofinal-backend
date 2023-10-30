export const getLogs = (req, res) => {
    req.logger.warning(`Alerta!`);
    res.send({message: 'Logger Test!'})
}