export default {
    data:{
        list: [],
        firstName: 'dnt',
        lastName: 'zhang',
        fullName:function(){
          return this.firstName + this.lastName
        }
    }
}