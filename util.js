/**
 * Created by Dankuer on 2016/7/31.
 */
module.exports={
    md5(str){
        return require('crypto').
            createHash('md5').
            update(str).
            digest('hex');
    }
}