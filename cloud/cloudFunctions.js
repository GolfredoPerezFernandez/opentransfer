
  let NDONE=1;
  let   ITMAX=20;
  let ndat=0; 
  let ma=0; 
  let mfit=0;
  let x=[]; 
  let y=[];
  let sig=[];
  let ia=[];
  let xi=0;
  let ochisq=0;
  let gridType=2;
  let lamdaInit=0.1; 
  let tol=0.1
  let lamdaHigh=100;
  let lamdaLow=0.001;    
  let temp=[[]];
  let oneda=[[]] ;
  let beta=[];
  let a=[];
  let covar=[[]];
  let alpha=[[]];
  let chisq=0;
  let ymod=0; 
  let wt=0;
  let sig2i=0;
  let dy=0;
  let newAtry=[];
  let newA=[];
  let newBeta=[];
  let dyda=[];
  let atry=[];
  let da=[];
  let malla=[];
  let w=[];
  let delta=[];
  let triangularModel=[];

Moralis.Cloud.define("LM",async (request)=>{

        //Copia la seleccion del usuario para iniciar 
        
      if(request.params.lamdaInit){
          lamdaInit=request.params.lamdaInit
      }else{
          lamdaInit=0.1
      }
      if(request.params.lamdaHigh){
          lamdaHigh=request.params.lamdaHigh
      }else{
          lamdaHigh=10
      }
      if(request.params.lamdaLow){
          lamdaLow=request.params.lamdaLow
      }else{
          lamdaLow=0.001
      }
      if(request.params.tol){
          tol=request.params.tol
      }else{
          tol=0.01
      }
      if(request.params.iterMax){
          ITMAX=request.params.iterMax
      }else{
          ITMAX=5
      }
      if(request.params.NDone){
          NDONE=request.params.NDone
      }else{          
          NDONE=1
      }

      if(request.params.partX&&request.params.partY){
          ma=request.params.partY.length
          x=[...request.params.partY]       
          w=[...request.params.partX]
          ndat=request.params.partY.length
      }  

      if(request.params.gridType!==undefined){
        
      gridType=request.params.gridType
      if(gridType===1){
          for(let i=1; i<ndat-1;i++){
        malla[i-1]=((w[i+1]+w[i-1])/2);
       
       }
      } 
      if( gridType===2){  
        for(let i=1; i<ndat-1;i++){
        malla[i-1]=((w[i+1]-w[i-1])/2)+w[i-1]; 
     
       }    
      } if( gridType===3){ 
        
        for(let i=1; i<ndat-1;i++){
             malla[i-1]=((w[i]-w[i-1])/2)+w[i-1];  
          } 
    } if(gridType===4){  
      for(let i=1; i<ndat-1;i++){
        
        malla[i-1]= ((w[i]+w[i-1])/2);
      }}

     } else {
        for(let i=1; i<ndat-1;i++){
          
          malla[i-1]= ((w[i]+w[i-1])/2);
        } 
    }
        for(let i=1; i<ndat-1;i++){
            if(( w[i-1]<malla[i-1])&&(malla[i-1]<=w[i])){
                 triangularModel[i-1]=(malla[i-1]-w[i-1])/(w[i]-w[i-1])      
            } else if((w[i]<malla[i-1])&&(malla[i-1]<w[i+1])){
                 triangularModel[i-1]=(w[i+1]-malla[i-1])/(w[i+1]-w[i])  
            } else {
                 triangularModel[i-1]=0.0  
            }
   }   
   
   y=[...triangularModel]     
   ndat=y.length 

   if(request.params.a!==undefined){
           a=[...request.params.a]
    }else{
    for(let i=0; i<ma; i++){        
           a[i]=1;
    }
  }
   // array of initial parameter values
      for (let i=0;i<ma;i++){
          ia[i] = true
      };
      
      for(let i=0; i<ma; i++){
          sig[i]=1;
        }  

     return  fit()
})
async function fit(){
        
  let j=0;
  let k=0;
  let l=0;
  let iter=0;
  let done=0;
  let alamda=lamdaInit;
  let atry=[]
  let beta=[]
  let da=[]
  
  for(j=0;j<ma;j++){
    
    if(!atry[j]){
      atry[j]=1
  }
  if(!beta[j]){
    beta[j]=0
    }
    if(!da[j]){
    da[j]=0
  }
}

mfit=0;


for(j=0;j<ma;j++){
    if(ia[j]){
        mfit++;
    }
}


for( j=0; j<mfit;j++){
  if(!oneda[j]){
    oneda[j]=[]
}
  
if(!temp[j]){
  temp[j]=[]
  }  
  
  for(let k=0; k<=1 ;k++){
     oneda[j][k]=0
}  

for(let k=0; k<=j;k++){
  temp[j][k]=0
} 
}

 
 
for( j=0; j<ma;j++){
  if(!alpha[j]){
    alpha[j]=[]
} 
if(!covar[j]){
  covar[j]=[]
  }  
  
for(let k=0; k<=j ;k++){
  alpha[j][k]=0
}  

for(let k=0; k<=j;k++){
    covar[j][k]=0
} 
}

newA=[...a]


 await mrqconf1()
 beta=[...newBeta]
 for(j=0;j<ma;j++){ //copía parametros
    atry[j]=a[j]
  }
  
  ochisq=chisq;//copia chisq
  
  for(iter=0;iter<ITMAX;iter++) {       
      if(done===NDONE){// final step
        alamda=0.0
      }
      
      for(let j=0; j<mfit;j++){//calcula el campio de parametros en covar
      
            for(let k=0;k<mfit;k++){                        
              covar[j][k]=alpha[j][k];                      
            }

            covar[j][j]=alpha[j][j]*(1.0+alamda);

            for(k=0;k<mfit;k++){// aqui temp es alpha
              temp[j][k]=covar[j][k]

            }

            oneda[j][0]=beta[j] //copian beta a oneda  
      }

     await gaussj();     // resuelven temp y oneda //alpha * delta = beta
    

      for(let j=0;j<mfit;j++){
        for(let k=0;k<mfit;k++){
           covar[j][k]=temp[j][k]
        }
           da[j]=oneda[j][0]
      }
      
       


      if(done===NDONE){          
      await  covsrtCovar(); 
      
      await covsrtAlpha(); 
       
        break
      } 
      let j=0
       for(let l=0;l<ma;l++){
            if(ia[l]){
              atry[l]=a[l]+da[j++]
            }
       }     
      newAtry=[...atry]
       await mrqconf2();     

       if(Math.abs(chisq-ochisq)<Math.max(tol,tol*chisq)){
             done++;
       }
    
       if(chisq<ochisq){
             alamda*=lamdaLow;
             ochisq=chisq;

             for(j=0;j<mfit;j++){
                 for(k=0;k<mfit;k++){
                   alpha[j][k]=covar[j][k]
                   
                 }
               beta[j]=da[j];
             }
             for(l=0;l<ma;l++){
               a[l]=atry[l]
             }
       } else {                                  
             alamda *=lamdaHigh;
             chisq=ochisq;    
       }
  }

let evarepsilon1=[];
let evarepsilon1Y=[];
let evarepsilon2Y=[];

for(let i=1; i<w.length-1;i++){
   evarepsilon1[i-1]=(1/Math.PI)*(g(malla[i-1],w[i-1])/(w[i]-w[i-1])-(((w[i+1]-w[i-1])*g(malla[i-1],w[i]))/((w[i]-w[i-1])*(w[i+1]-w[i])))+ g(malla[i-1],w[i+1])/(w[i+1]-w[i]))
}

for(let i=1; i<a.length-1; i++) {
   evarepsilon1Y[i-1]=a[i]*evarepsilon1[i-1];
}

for(let i=1; i<a.length-1; i++) {
  evarepsilon2Y[i-1]=a[i]*triangularModel[i-1];
}

let evarX=[]

for(let i=1; i<a.length-1; i++) {
 evarX[i-1]=malla[i-1]
}


await covsrtCovar(); 
await covsrtAlpha();

let realPartYC=[...evarepsilon1Y]
let imaginaryPartYC=[...evarepsilon2Y]
let imaginaryPartYA=[...x]
let newAlpha=[...alpha]
let newDelta=0
let change=0

for(let j=0;j<a.length-2;j++){
        for(let i=-1;i<0;i= imaginaryPartYC[j]-imaginaryPartYA[j]){  
        
            newDelta= Math.sqrt(0.0000000000000001*newAlpha[j][j])
            change+=newDelta

            imaginaryPartYC[j]=change+imaginaryPartYC[j]

                   
         }   
        realPartYC[j]=change+realPartYC[j]  
        change=0;
}

let diff=[]
for(let i=1; i<a.length-1; i++) {
     diff[i-1]=(imaginaryPartYC[i-1]-imaginaryPartYA[i-1])*100
}

let res;

res={
  dfRealPartX:[...evarX], 
  dfRealPartY: [...realPartYC ],
  dfImaginaryPartX: [...evarX],
  dfImaginaryPartY: [...imaginaryPartYC],
  imaginaryPartX:[...w],
  imaginaryPartY:[...x],
  chisq:chisq,  
  lamdaLow: lamdaLow,
  lamdaHigh: lamdaHigh,
  lamdaInit: lamdaInit,
  deltachi:0,
  tolerance:tol,
  params:[...a], 
  alpha:[...alpha],
  difference:[...diff]                  
}

  return res;
}


function g(x, y){
        
  let result= (x+y)*Math.log10(Math.abs(x+y))+(x-y)*Math.log10(Math.abs(x-y))
  return result
}

    function funcs1(xy){
          ymod=0;
          let na=newA.length

          for(let i=0;i<na; i++){
          
            ymod+=newA[i]*xy
            dyda[i]=x[i]
            }

      };

    function covsrtAlpha(){
          var k;
          for(let i=mfit;i<ma;i++){
              for(let j=0;j<i+1;j++){
                alpha[i][j]= alpha[j][i]=0;
              }
          }
          k=mfit-1;
          for(let j=ma-1;j>=0;j--){
            if(ia[j]){
              for(let i=0;i<ma;i++){
                let swap= alpha[i][j];      
                alpha[i][j]=alpha[i][k];      
                alpha[i][k]=swap;
              }

              for(let i=0;i<ma;i++){
                let swap= alpha[j][i];
                alpha[j][i]=alpha[k][i];
                alpha[k][i]=swap;
              }
            
            k--; 
            }
          }    
    };
  
        
    async function mrqconf1(){
       
        let dy=0;
        let wt=0;

        sig2i=1;
        
      for(let j=0;j<ma;j++){
        if(!dyda[j]){
          dyda[j]=1
        }
      }
    
      for(let j=0;j<mfit;j++){     
        if(!alpha[j]){
          alpha[j]=[]
      }

      for(let k=0;k<=j;k++){
          alpha[j][k]=0
      }
      beta[j]=0
      }
    
      chisq=0;
      
      for(let i=0;i<ndat;i++){
        xi=x[i]
        funcs1(xi);
        sig2i=1.0/(sig[i]*sig[i])///sigma*22
          
        dy=y[i]-ymod;
        
        let j=0;
        for(let l=0;l<ma;l++){
              if(ia[l]){
                    wt=dyda[l]*sig2i;
                    
                    let k=0;
                    for(let m=0;m<l+1;m++){
                        if(ia[m]){  
                            alpha[j][k++] += wt*dyda[m]
                            
                        }
                    }
                    beta[j++] += dy*wt;
                    
               
                }
          }
          chisq +=dy*dy*sig2i;
        }
    
          
newBeta=[...beta]
          for(let j=1;j<mfit;j++){
            for(let k=0;k<j;k++){
              alpha[k][j]=alpha[j][k]
            }
          } 
          

      };

    async function  mrqconf2(){
        let dy=0;
            let wt=0;
          for(let j=0;j<ma;j++){ 
            dyda[j]=1
            }
                      
          for( let j=0; j<ma;j++){
                  
                if(!covar[j]){
                  covar[j]=[]
                  }  
                  

                for(let k=0; k<=j;k++){
                    covar[j][k]=0
                } 

                da[j]=0
          }
  
          chisq=0;
          
          for(let i=0;i<ndat;i++){
              xi=x[i]
                 
             await funcs2(xi);
              
              sig2i=1.0/(sig[i]*sig[i])///sigma*2 
              dy=y[i]-ymod;
 
              let j=0;
              for(let l=0;l<ma;l++){
                      if(ia[l]){
                        wt=dyda[l]*sig2i;     
                        
                         let k=0             
                        for(let m=0;m<l+1;m++){
                                 
                            if(ia[m]){  
                                covar[j][k] =covar[j][k]+ wt*dyda[m]     
                                k++;  
                                            
                            }
                            
                        }            
                        da[j]=da[j]+dy*wt;
                        
                              
                        j++
                         
                      }
              }
              
              chisq += dy*dy*sig2i;        
            }
             
          for(let j=1;j<mfit;j++){    
                for(let k=0;k<j;k++){

                  covar[k][j]=covar[j][k]
                }
          }   
          
      };

function funcs2(xy){
    
    ymod=0;
    
    for(let i=0;i<newAtry.length; i++){
      
      ymod+=newAtry[i]*xy
      
          dyda[i]=x[i]
      }
      
      
};

function hold(i, val){
    ia[i]=false
    a[i]=val
};

function free(i){
    ia[i]=true
};

function covsrtCovar(){
      let i,j,k;
      for( i=mfit;i<ma;i++){
          for(let j=0;j<i+1;j++){
            covar[i][j]=covar[j][i]=0.0;
          }
      }
    k=mfit-1;
    for( j=ma-1;j>=0;j--){
          if(ia[j]){

                  for(let i=0;i<ma;i++){
                      let swap= covar[i][j];
                      covar[i][j]=covar[i][k]; 
                      covar[i][k]=swap;
                  }

                    for(let i=0;i<ma;i++){
                      let swap= covar[j][i];
                      covar[j][i]=covar[k][i];
                      covar[k][i]=swap;
                  }
                  k--;
            }
        }
};
      
function gaussj(){

let icol=0;
let irow =0;
let i,j,k,l;
let big;
let dum;
let pivinv;
let m=1;
let n=temp.length;
let indxc=[];
let indxr=[];
let ipiv=[];

for(let j=0;j<n;j++){
  ipiv[j]=0;
  indxc[j]=0;
  indxr[j]=0;
};

        for( i=0;i<n;i++){          
            big=0.0;
            for( j=0;j<n;j++){                                                                                                                                                                                                                                                                                                                                                                                                                                      
              if(ipiv[j] !== 1) {                                                                                                                                        
                for( k=0;k<n;k++){ 
                    if(ipiv[k] == 0){ 
                      if(Math.abs(temp[j][k]) >= big){
                        big=Math.abs(temp[j][k]);
                        irow=j;
                        icol=k;        
                      }
                    }        
                }
            }             
          }
                 
          ++(ipiv[icol]);

          if(irow !== icol){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                for( l=0;l<n;l++){
                  let swap= temp[irow][l];
                  temp[irow][l]=temp[icol][l];
                  temp[icol][l]=swap;
                }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                for( l=0;l<m;l++){
                  let swap= oneda[irow][l];
                  oneda[irow][l]=oneda[icol][l];
                  
                  oneda[icol][l]=swap;      
                }                  
              }   

              indxr[i]=irow;
              indxc[i]=icol;
              
              if(temp[icol][icol]===0.0) {
                break
              }
              
              pivinv=1/temp[icol][icol];
              temp[icol][icol]=1.0;
              for( l=0;l<n;l++) {
                  temp[icol][l]*=pivinv;
                  
              }
              for( l=0;l<m;l++) {
                oneda[icol][l]*=pivinv;                      
               }

              for(let ll=0;ll<n;ll++){
                if(ll!==icol){
                  dum=temp[ll][icol];
                  temp[ll][icol]=0;
                  for( l=0;l<n;l++){
                         temp[ll][l] -=  temp[icol][l]*dum;                       
                  }
                  for( l=0;l<m;l++){
                    oneda[ll][l] -= oneda[icol][l]*dum;        
                                       
                  }
                          
                  }
              }  

              
      }                

      for(let l=n-1;l>=0;l--){
        if(indxr[l]!== indxc[l]){
            for(let k=0;k<n;k++){
                let swap= temp[k][indxr[l]]
                temp[k][indxr[l]]=temp[k][indxc[l]]
                temp[k][indxc[l]]=swap;
          }
        }
}                                      

}



