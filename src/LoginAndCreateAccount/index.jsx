// Import necessary hooks and components from React
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import various functions from Firebase SDKs
import 
{ 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail, 
  onAuthStateChanged, 
} from "firebase/auth";

import 
{ 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  Timestamp, 
} from 'firebase/firestore';

// Import Firebase configuration and instances
import db from '../FirebaseConfig';
import {auth} from '../FirebaseConfig';

// Import SweetAlert2 for displaying alerts
import Swal from 'sweetalert2'

// Import Ant Design components and icons
import 
{ LockOutlined, 
  UserOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined 
} from '@ant-design/icons';

import 
{ 
  Button, 
  Form, 
  Input,
  Modal,
  ConfigProvider,
  Space,  
} from 'antd';

// Import the background image
import LoginCreateBg from '../assets/images/applogo.png';

// Main component
function LoginAndCreateAccount() 
{
  // Initialize navigation hook
  const navigate = useNavigate();

  // Initialize form instances
  const [createForm] = Form.useForm();
  const [loginForm] = Form.useForm();

  // State to manage registration modal
  const [register, setRegister] = useState(false);

  // Effect to set the document title and check if the user is already logged in
  useEffect(() => 
  {
    document.title = `Login`;

    onAuthStateChanged(auth, (user)=>
    {
      if(user)
      {
        navigate('/');
      }
    });

  }, []);

  // Function to add user profile to Firestore
  const addUserProfileToFirestore = async (userId, displayName) => 
  {
    await addDoc(collection(db, 'db-socmedapp-username'), 
    {
      userId: userId,
      displayName: displayName,
      firstName: createAccount.firstname,
      lastName: createAccount.lastname,
      accountCreated: Timestamp.now(),
    });
  };

  // Function to check the availability of a display name
  const checkDisplayNameAvailability = async (displayName) => 
  {
    const querySnapshot = await getDocs
    (
      query(collection(db, 'db-socmedapp-username'), where('displayName', '==', displayName))
    );

    return querySnapshot.empty;
  };

  // State to store create account and login details
  const [createAccount, setCreateAccount] = useState
  ({

    firstname:'',
    lastname:'',
    username: '',
    email: '',
    password: '',
  });

  const [loginAccount, setLoginAccount] = useState
  ({
    userEmail: '',
    userPassword:'',
  })

  // Function to handle login form submission
  const onFinishLogin = async () => 
  {
    signInWithEmailAndPassword(auth, loginAccount.userEmail, loginAccount.userPassword)
      .then((userCredential) => 
      {
        const user = userCredential.user;

        // Display a loading indicator using SweetAlert
        Swal.fire
        ({
          timer: 2000,
          showConfirmButton: false,
          willOpen: () => 
          {
            Swal.showLoading();
          },
          willClose: () => 
          {
            // Display a success message using SweetAlert
            Swal.fire
            ({
              icon: 'success',
              title: 'Successfully logged in!',
              showConfirmButton: false,
              timer: 2000,
            });
              // Reset input fields
              loginForm.resetFields();
              // Navigate to dashboard
              navigate('/');
          },
        });
      })
      .catch((error) => 
      {
        Swal.fire
        ({
            timer: 2000,
            showConfirmButton: false,
            willOpen: () => 
            {
                Swal.showLoading();
            },
            willClose: () => 
            {
              Swal.fire
              ({
                  allowOutsideClick: false,
                  icon: 'error',
                  title: 'Error!',
                  text: 'Invalid Credentials!',
                  showConfirmButton: true,
                  confirmButtonColor: '#860A35',
                  confirmButtonText: 'Try again',
              }).then(() => 
              {
                  // Reset input fields
                  loginForm.resetFields();
                  console.log("login failed");
              });
            },
        });
    });
  };

  // Function to handle login form submission failure
  const onFinishFailedLogin = () => 
  {
    // Display an error message using SweetAlert
    if(loginAccount.userEmail === "" || loginAccount.userPassword === "")
    {
        Swal.fire
      ({
        icon: 'error',
        title: 'Error!',
        text: 'Please input your email and password',
        showConfirmButton: true,
        confirmButtonColor: '#860A35',
      });
    }
  };

  // Function to handle create account form submission
  const onFinishCreateAccount = async () => 
  {
    // Check display name availability
    const displayNameAvailable = await checkDisplayNameAvailability
    (
      createAccount.username
    );

    // Handle display name not available
    if (!displayNameAvailable) 
    {
      Swal.fire
      ({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Error!',
        text: 'Username already in use!',
        showConfirmButton: true,
        confirmButtonColor: '#860A35',
      });

      return;
    }

    createUserWithEmailAndPassword(auth, createAccount.email, createAccount.password)
      .then(async (userCredential) => 
      {
        const user = userCredential.user;

        updateProfile(auth.currentUser, 
        {
          displayName: createAccount.username,
          photoURL: "https://www.svgrepo.com/show/382106/male-avatar-boy-face-man-user-9.svg",
        });

        await addUserProfileToFirestore(user.uid, createAccount.username, createAccount.firstname, createAccount.lastname);

        Swal.fire
        ({
          timer: 2000,
          showConfirmButton: false,
          willOpen: () => 
          {
            Swal.showLoading();
          },

          willClose: () => 
          {
            Swal.fire
            ({
              icon: 'success',
              title: 'Added!',
              text: `Account successfully registered.`,
              showConfirmButton: false,
              timer: 2000,
            });
            
            createForm.resetFields();
            setRegister(false);
          
          },
        });
      })
      .catch((error) => 
      {
        Swal.fire
        ({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Error!',
          text: 'Email already in use!',
          showConfirmButton: true,
          confirmButtonColor: '#860A35',
        });
        console.log(error);
      });
  };

  // Function to handle create account form submission failure
  const onFinishFailedCreateAccount = () => 
  {
    if (
      createAccount.firstname === '' ||
      createAccount.lastname === '' ||
      createAccount.username === '' ||
      createAccount.email === '' ||
      createAccount.password === ''
    ) {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required!',
        showConfirmButton: true,
        confirmButtonColor: '#860A35',
      });
    }
  };

  // Function to handle forgot password
  const forgotPassword = async () =>
  {
    const { value: useremail } = await Swal.fire
    ({
      title: "Input email address",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "Ex. JohnDoe@gmail.com",
      confirmButtonColor: '#50b7f5',
      confirmButtonText: 'Send',
    });

    if (useremail) 
    {
      Swal.fire
            ({
              icon: 'success',
              title: `Email has been sent: ${useremail}`,
              showConfirmButton: false,
              timer: 2000,
            });
      sendPasswordResetEmail(auth, useremail)
        .then(() => 
        {
          // Password reset email sent then clear fields.
          loginForm.resetFields();
        })
        .catch((error) => 
        {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    };
  };
  
  // Function to show registration modal
  const showModalRegister = () => 
  {
    setRegister(true);
  };

  // Function to handle modal cancellation
  const handleCancel = () => 
  {
    createForm.resetFields();
    setRegister(false);
  };

  // JSX structure
  return (
    <>
    {/* ... (JSX structure for login and create account forms) ... */}
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="row m-0 p-0">
          <div className="col-6 d-flex align-items-center justify-content-center">
            <img src={LoginCreateBg} alt="Login and create account background" className="img-fluid" />
          </div>
        
          <div className="col-6 d-flex align-items-center justify-content-center">
            <div className="card border-0">
              <h1 className="display-6 mb-xxl-2">Happening Today</h1>
              <h3 className="mb-xxl-3">Join now.</h3>
              <Form
                form={loginForm}
                name="normal_login"
                className="login-form"
                onFinish={onFinishLogin}
                onFinishFailed={onFinishFailedLogin}
                initialValues=
                {{
                  remember: true,
                }}
              >
                <Form.Item
                  name="email"
                  onChange={(e) => 
                    setLoginAccount
                  ({...loginAccount,
                       userEmail: e.target.value
                  })}
                  rules=
                  {[
                    {
                      type:'email',
                      required: true,
                      message: 'Please input your Email!',
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  onChange={(e) => 
                    setLoginAccount
                  ({...loginAccount,
                       userPassword: e.target.value
                  })}
                  rules=
                  {[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                    iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <div className="row text-center">
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="login-form-button"
                    style={{ backgroundColor: '#50b7f5' }}
                    >
                    Log in
                  </Button>
                  <span className='m-1'>Or</span><a className="login-form-forgot" style={{ color: '#50b7f5' }} onClick={showModalRegister}>Register now!</a>
                </Form.Item>
                </div>

                <div className="row text-center">
                  <a 
                    onClick={forgotPassword} 
                    className="login-form-forgot"
                    style={{ color: '#50b7f5' }}
                  >
                      Forgot password
                  </a>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <ConfigProvider
            theme=
            {{
              components : 
              {
                Modal:
                {
                  titleFontSize: 40,
                  colorBgMask:"rgba(0, 0, 0, .50)",
                },

              }
            }}
          >

          <Modal
          title="Create Account"
          titleFontSize={100}
          open={register}
          onCancel={handleCancel}
          maskClosable={false}
          footer={(_, {}) => 
          (
            <>
            </>
          )}

          >
            <Form 
              form={createForm}
              name="normal_createlogin"
              className="login-form"
              onFinish={onFinishCreateAccount}
              onFinishFailed={onFinishFailedCreateAccount}
              autoComplete="off"
              initialValues=
              {{
                remember: true,
              }}
            >
              <Form.Item
                name="firstname"
                value={createAccount.firstname}
                onChange={(e) => 
                  setCreateAccount
                ({...createAccount,
                     firstname: e.target.value
                })}
                rules=
                {[
                  {
                    required: true,
                    message: 'Please input your First name!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" />
              
              </Form.Item>

              <Form.Item
                name="lastname"
                value={createAccount.lastname}
                onChange={(e) => 
                  setCreateAccount
                ({...createAccount,
                  lastname: e.target.value
                })}
                rules=
                {[
                  {
                    required: true,
                    message: 'Please input your Last name!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Lastname" />
              </Form.Item>

              <Form.Item
                name="username"
                value={createAccount.username}
                onChange={(e) => 
                  setCreateAccount
                ({...createAccount,
                     username: e.target.value
                })}
                rules=
                {[
                  {
                    min:6,
                    required: true,
                    message: 'Please input your Username! And Username must be at least 6 characters.',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>

              <Form.Item
                name="email"
                value={createAccount.email}
                onChange={(e) => 
                  setCreateAccount
                ({...createAccount,
                     email: e.target.value
                })}
                rules=
                {[
                  {
                    type:'email',
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                value={createAccount.password}
                onChange={(e) => 
                  setCreateAccount
                ({...createAccount,
                     password: e.target.value
                })}
                rules=
                {[
                  {
                    min:6,
                    required: true,
                    message: 'Please input your Password! And Password must be at least 6 characters.',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="New Password"
                  iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item>
                  <Space className='d-flex justify-content-center'>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      className="login-form-button"
                      style={{ backgroundColor: '#50b7f5' }}
                    >
                      Register
                    </Button>

                    <Button 
                      type="primary" 
                      onClick={handleCancel} 
                      style={{ backgroundColor: '#50b7f5' }}
                    >
                        Cancel
                    </Button>
                  </Space>
              </Form.Item>
            </Form>
          </Modal>
        </ConfigProvider>
    </>
  );
}

// Export the LoginAndCreateAccount component as the default export
export default LoginAndCreateAccount;