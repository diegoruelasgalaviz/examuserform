import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import styles from '../styles/Home.module.css'
import { firebase } from '../firebase';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import axios from 'axios';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      serial: "",
      name: "",
      orderamount: "",
      previewImage: "",
      pdfUrl: "",
      state: 0
    }
  }

  handleChange = (e) => {
    if(e.target.files[0]){
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            // console.log(reader.result);
            this.setState({ previewImage: reader.result})
        }
        this.handleUpload(image);
    }
  }

  handleUpload = (pdf) => {
    const data = new FormData();
    if ( pdf ) {
        data.append( 'orderPdf', pdf, pdf.name );
        axios.post( '/api/upload', data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        })
        .then( ( response ) => {
            if ( 200 === response.status ) {
                // If file size is larger than expected.
                if( response.data.error ) {
                    if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
                        alert( 'Max size: 2MB' );
                    } else {
                        console.log( response.data );
                        // If not the given file type
                        alert( response.data.error );
                    }
                } else {
                    // Success
                    let fileName = response.data;
                    {/*
                    this.setState({
                        pdfUrl: fileName.location
                    })
                    console.log( 'fileName', fileName.location );
                    */}
                    // alert( 'File Uploaded', '#3089cf' );
                }
            }
        }).catch( ( error ) => {
            // If another error
            alert( error, 'red' );
        });
    } else {
        // if file not selected throw error
        alert( 'Please upload file' );
    }
}

  handleID = () => {
    
      
      let foundsomething = false;
      let idholder = this.state.serial;
      const db = firebase.firestore();
      console.log(idholder);
      const getUser = db.collection("users").where("serial", "==", idholder)
      .get()
      .then((querySnapshot) => {
        console.log("asd");
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
                console.log("asd");
                  toast.success('User has been prompt successfully', {
                      position: "bottom-left",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true
                  });
                  foundsomething = true;
              this.handleNameWrite(doc.data().name);
          });
          if(foundsomething == false){
            Swal.fire("no se ha encontrado ningún usuario, prueba insertando un id como aa33");
          }
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });

  
    
  }

  handleNameWrite(namefromdata){
    this.setState({name: namefromdata});
    (async () => {
    const { value: amount } = await Swal.fire({
      input: 'number',
      inputLabel: 'Amount charged',
      inputPlaceholder: 'Enter the amount'
    })
    
    if (amount) {
      Swal.fire(`Entered amount: ${amount}`);
      this.setState({orderamount: amount})
      
      

    }
   })();
  }
  
  Submit= () => {
    
    
    if(this.state.name != ""){
      if(this.state.orderamount != ""){
        if(this.state.previewImage != ""){
          const db = firebase.firestore();
          const dbOrderRef = db.collection('orders');
          dbOrderRef.add(this.state).then(() => {
            toast.success('Order has been created successfully.', {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        });
          Swal.fire(`Your order has been Submited`);
        }else{
          Swal.fire(`Inserta El archivo Pdf`);
        }
      }else{
        Swal.fire(`Inserta todos lo campos, busca a un usuario por ID por ejemplo aa33`);
      }
    }else{
      Swal.fire(`Inserta todos lo campos, busca a un usuario por ID por ejemplo aa33`);
    }
    
    
  }

  render(){
    return(
    <div className={styles.container}>
      <Head>
        <title>Exam</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
        crossorigin="anonymous"
      />
      </Head>

      <main className={styles.main}>
        
      <div className="container">
          <div className="frame">
            <div className="navs text-center">
              <h3 style={{color: "white"}}>Exam</h3>
            </div>
              <h4 style={{color: "white"}}>ID:</h4>
              <div className="d-flex">
              <input 
              className="form-styling"
              placeholder="enter your id here"  
              onChange={e => this.setState({ serial: e.target.value })}
              />
              <button className="btn btn-primary"onClick={this.handleID}>Search</button>
              </div>
              <br/>
            <div className="text-center">
                <h4 style={{color: "white"}}>Name: {this.state.name}</h4 >
            </div>
            <br/>
            <div className="row text-center" >
              <h4 style={{color: "white"}} >Pdf File uploader</h4 >
              
              <input 
                  type="file" 
                  className=""
                  name="productImage"
                  accept="application/pdf, application/vnd.ms-excel"
                  onChange={this.handleChange}
              />
            </div>
            <br/>
            <div className="text-center" >
                <h4 style={{color: "white"}}>
                  Amount: {this.state.orderamount}
                </h4>
                
            </div>
            <br/>
             <div className="text-center">

               <button className="btn btn-primary" onClick={this.Submit}>Mandar</button>
              </div>
            </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <h4>Diego Ruelas</h4>
      </footer>
    </div>
    )
  }
}

export default Home;
