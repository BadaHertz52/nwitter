import { dbService } from "../Fbase";

//nweet
export const getNweets = async(id , setFun)=>{
  const getDocs = await dbService
    .collection(`nweets_${id}`)
    .get();
  const nweets = getDocs.docs.map(doc => ({
    id: doc.id ,
    ...doc.data()}))  ;
  setFun(nweets)
};

//프로필 

export const getProfileDoc = (id)=>dbService.collection("users").doc(id)  ;

export const getProfile = async(id ,setProfile)=>{
  await getProfileDoc(id).get().then((doc)=>{
    if(doc.exists){
      setProfile(doc.data());
    }else {
      console.log("No such profile document!")
    }
  }).catch(error => {
    console.log("Error getting document:" ,error)
  })
};

export const findMyProfile =(id ,setIsMyProfile)=> getProfileDoc(id).get()
.then(doc => {
  if(doc.exists){
    setIsMyProfile(true);
  }else {
    setIsMyProfile(false);
    console.log("No such document");
  }
}).catch((e) => {
  console.log("Error getting document", e)
});