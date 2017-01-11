/**
 * 用于本地开发cms相关接口时，读取173机器上的cms文档使用
 * Created by liucong，2017-01-11 16:05
 **/

'use strict';

const fs = require('fs');
const path = require('path');
const PromiseResult = require('./promise_result.js');
const sep = path.sep;

let path_config = {
    data_preview_dir : `${sep}cms${sep}data_preview`,
    data_dir : `${sep}cms${sep}data`,
    article_preview_dir : `${sep}cms${sep}article_preview`,
    article_dir : `${sep}cms${sep}article`,
    page_preview_dir : `${sep}cms${sep}page_preview`,
    page_dir : `${sep}cms${sep}page`
};

let singleton = {};

singleton.requestCMS = function(docId,type,preview = false){
    try{
        let responseResult = new PromiseResult();

        //文档绝对路径
        let DEV_CMS_File_DIR = "/cms/";

        //根据请求类型确定访问目录
        if(type == 'data'){
            DEV_CMS_File_DIR =  preview ? path_config["data_preview_dir"] : path_config["data_dir"];
        }else if(type == 'article'){
            DEV_CMS_File_DIR =  preview ? path_config["article_preview_dir"] : path_config["article_dir"];
        }else if( type === 'page' ){
            //通过page builder构建的页面数据
            DEV_CMS_File_DIR =  preview ? path_config["page_preview_dir"] : path_config["page_dir"];
        }else{
            responseResult.status = systemStatus.ral_error;
            responseResult.message  = '失败';
            responseResult.error = err;
            return responseResult;
        }

        //直接通过ID读取
        DEV_CMS_File_DIR = path.join( DEV_CMS_File_DIR , docId + '.json' );

        return new Promise( function( resolve, reject ){
            fs.readFile( DEV_CMS_File_DIR, function(err, data){
                if( err ){
                    return reject( err );
                }
                try{
                    data = JSON.parse( data );
                }catch(e){
                    return reject(e);
                }
                resolve( data );
            });
        } ).then( function( data ){
            responseResult.data = data;
            responseResult.message = "OK";
            responseResult.status = 0;

            return responseResult;
        } ).catch( function( err ){
            responseResult.status = -1;
            responseResult.message  = `读取CMS内容[${docId}] 出错`;
            responseResult.error = err;
            return responseResult;
        } );
    }catch(error){
        console.log("远程读取cms出错啦=>",error)
    }
}

module.exports = singleton;