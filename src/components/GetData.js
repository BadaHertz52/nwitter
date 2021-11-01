import { dbService } from "../Fbase";


export const getNweets = async(id , setFun)=>{
  const getDocs = await dbService
    .collection(`nweets_${id}`)
    .get();
  const nweets = getDocs.docs.map(doc => ({
    id: doc.id ,
    ...doc.data()}))  ;
  setFun(nweets)
};