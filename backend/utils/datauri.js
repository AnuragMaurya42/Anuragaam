import Datauri from 'datauri';
import path from 'path';

const parser = new Datauri();
const getDatauri = (file) =>{
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
export default getDatauri;