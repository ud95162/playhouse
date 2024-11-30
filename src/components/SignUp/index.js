// SignupForm.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    alpha, Button,
    FormControlLabel,
    InputBase,
    InputLabel,
    Radio,
    RadioGroup,
    styled
} from "@mui/material";
import { supabase } from "../supabaseClient"; // Import Supabase client

// Styled Input Component
const BootstrapInput = styled(InputBase)(({ theme, error }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid',
        borderColor: error ? '#FF5733' : '#E0E3E7',
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:focus': {
            boxShadow: `${alpha(error ? '#FF5733' : '#fe5e15', 0.25)} 0 0 0 0.2rem`,
            borderColor: error ? '#FF5733' : '#fe5e15',
        },
    },
}));

function SignupForm() {
    const [showGuardianFields, setShowGuardianFields] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [resume, setResume] = useState(null);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('**First Name is Required'),
        lastName: Yup.string().required('**Last Name is Required'),
        gender: Yup.string().required('**Gender is Required'),
        dob: Yup.date().required('**Date of Birth is Required'),
        email: Yup.string().email('**Invalid email address').required('**Email is Required'),
        contactNo: Yup.string()
            .required('**Contact No is Required')
            .matches(/^[0-9]{10}$/, '**Contact number must be 10 digits'),
        courseType: Yup.string().required('**Course Type is Required'),
        guardianName: Yup.string().when('courseType', {
            is: 'primary',
            then: (schema) => schema.required('**Guardian Name is Required'),
        }),
        guardianRelationship: Yup.string().when('courseType', {
            is: 'primary',
            then: (schema) => schema.required('**Guardian Relationship is Required'),
        }),
        guardianContactNo: Yup.string().when('courseType', {
            is: 'primary',
            then: (schema) =>
                schema
                    .required('**Guardian Contact No is Required')
                    .matches(/^[0-9]{10}$/, '**Guardian contact number must be 10 digits'),
        }),
        profileImage: Yup.mixed()
            .required('**Profile Image is Required')
            .test(
                'fileSize',
                '**Profile Image must be less than 2MB',
                value => !value || (value && value.size <= 2000000)
            )
            .test(
                'fileType',
                '**Profile Image must be a JPEG or PNG',
                value => !value || (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
            ),
        resume:Yup.mixed()
            .required('** Resume is Required')
            .test(
                'fileSize',
                '**Profile Image must be less than 2MB',
                value => !value || (value && value.size <= 2000000)
            )
            .test(
                'fileType',
                '**File must be a pdf or text',
                value => !value || (value && ['application/pdf', 'text/plain'].includes(value.type))
            ),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            fullName: '',
            gender: '',
            dob: '',
            email: '',
            contactNo: '',
            courseType: '',
            guardianName: '',
            guardianRelationship: '',
            guardianContactNo: '',
            profileImage: null, // New initial value
            resume: null,
            whatsApp: '',
        },
        // validationSchema: Yup.object({
        //     firstName: Yup.string().required('**First Name is Required'),
        //     lastName: Yup.string().required('**Last Name is Required'),
        //     fullName: Yup.string().required('**Full Name is Required'),
        //     gender: Yup.string().required('**Gender is Required'),
        //     dob: Yup.date().required('**DOB is Required'),
        //     email: Yup.string().email('**Invalid email address').required('**Email is Required'),
        //     contactNo: Yup.string().required('**Contact No is Required'),
        //     courseType: Yup.string().required('**Course Type is Required'),
        //     guardianName: Yup.string().when('courseType', {
        //         is: (val) => val === 'primary',
        //         then: (schema) => schema.required('**Guardian Name is Required'),
        //         otherwise: (schema) => schema.nullable(),
        //     }),
        //     guardianRelationship: Yup.string().when('courseType', {
        //         is: (val) => val === 'primary',
        //         then: (schema) => schema.required('**Relationship is Required'),
        //         otherwise: (schema) => schema.nullable(),
        //     }),
        //     guardianContactNo: Yup.string().when('courseType', {
        //         is: (val) => val === 'primary',
        //         then: (schema) => schema.required('**Contact No is Required'),
        //         otherwise: (schema) => schema.nullable(),
        //     }),
        // }),
        validationSchema,
        onSubmit: async values => {
            console.log(values)
            try {
                let profileImageUrl = null;
                let resumeUrl = null;

                if (profileImage) {
                    profileImageUrl = await uploadFile('profile-images', 'prof-images', profileImage);
                }

                if (resume) {
                    resumeUrl = await uploadFile('profile-images', 'resume', resume);
                }

                if (profileImageUrl) {
                    console.log('Profile image uploaded successfully:', profileImageUrl);
                } else {
                    console.error('Failed to upload profile image.');
                }

                if (resumeUrl) {
                    console.log('Resume uploaded successfully:', resumeUrl);
                } else {
                    console.error('Failed to upload resume.');
                }



                // Insert the form data into Supabase Database
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([{
                        first_name: values.firstName,
                        last_name: values.lastName,
                        gender: values.gender,
                        dob: values.dob,
                        email: values.email,
                        contact_no: values.contactNo,
                        course_type: values.courseType,
                        guardian_name: values.guardianName,
                        guardian_relationship: values.guardianRelationship,
                        guardian_contact_no: values.guardianContactNo,
                        profile_image: profileImageUrl,
                        resume: resumeUrl,
                        whatsapp_no: values.whatsApp,
                    }]);

                if (insertError) throw insertError;

                alert('Student added successfully!');
                formik.resetForm();

            } catch (error) {
                console.error('Error submitting form:', error.message);
                alert('An error occurred. Please try again.');
            }
        },
    });


    // Handling changes for course type
    const handleCourseTypeChange = (e) => {
        const value = e.target.value;
        formik.setFieldValue('courseType', value);
        setShowGuardianFields(value === 'primary');
    };

    const handleResumeChange = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            formik.setFieldValue('resume', file).then(() => {
                formik.validateField('resume'); // Explicitly trigger validation after setting value
            });
        }
        formik.setFieldTouched('resume', true); // Mark the field as touched to trigger validation

    }
    // Handling profile image change
    const handleImageChange = (e) => {
        setProfileImagePreview(null)
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            formik.setFieldValue('profileImage', file).then(() => {
                formik.validateField('profileImage'); // Explicitly trigger validation after setting value
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        formik.setFieldTouched('profileImage', true); // Mark the field as touched to trigger validation
    };

    // Helper function to upload a file to Supabase
    const uploadFile = async (bucketName, folder, file) => {
        try {
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(`${folder}/${Date.now()}_${file.name}`, file);

            if (error) {
                console.error(`Error uploading ${file.name}:`, error.message);
                return null; // Return null on error
            }

            if (data) {
                // Get the public URL for the uploaded file
                const { data: publicData, error: urlError } = supabase
                    .storage
                    .from(bucketName)
                    .getPublicUrl(data.path);

                if (urlError) {
                    console.error(`Error getting public URL for ${file.name}:`, urlError.message);
                    return null; // Return null on error
                }

                return publicData.publicUrl; // Return the public URL for the file
            }
        } catch (uploadError) {
            console.error(`Upload failed for ${file.name}:`, uploadError);
            return null;
        }
    };

    return (
        <div className="container" >
            <div className="form-container">

                <form onSubmit={formik.handleSubmit} className="form">
                    <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
                        <p style={{fontWeight:"normal",fontSize:"14px",color:"red"}}>Please Fill the Required Fields *</p>
                    </div>

                    <div className="form-group-container">
                        <p>Personal Details</p>
                        <div className="name">
                            <div className="form-group">
                                <InputLabel shrink>*First Name</InputLabel>
                                <BootstrapInput
                                    {...formik.getFieldProps('firstName')}
                                    error={formik.touched.firstName && !!formik.errors.firstName}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <div className="error-text">{formik.errors.firstName}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <InputLabel shrink>*Last Name</InputLabel>
                                <BootstrapInput
                                    {...formik.getFieldProps('lastName')}
                                    error={formik.touched.lastName && !!formik.errors.lastName}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <div className="error-text">{formik.errors.lastName}</div>
                                )}
                            </div>
                        </div>

                        <div className="name">
                            <div className="form-group">
                                <InputLabel shrink>*Gender</InputLabel>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={(e) => formik.setFieldValue('gender', e.target.value)}
                                >
                                    <FormControlLabel value="Female" control={<Radio sx={{
                                        color: '#fe5e15',
                                        '&.Mui-checked': {color: '#FF5733'}
                                    }}/>} label="Female"/>
                                    <FormControlLabel value="Male" control={<Radio sx={{
                                        color: '#fe5e15',
                                        '&.Mui-checked': {color: '#FF5733'}
                                    }}/>} label="Male"/>
                                </RadioGroup>
                                {formik.touched.gender && formik.errors.gender && (
                                    <div className="error-text">{formik.errors.gender}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <InputLabel shrink>*Date of Birth</InputLabel>
                                <BootstrapInput
                                    type="date"
                                    {...formik.getFieldProps('dob')}
                                    error={formik.touched.dob && !!formik.errors.dob}
                                />
                                {formik.touched.dob && formik.errors.dob && (
                                    <div className="error-text">{formik.errors.dob}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group-container">
                        <p>Contact Details</p>
                        <div className="name" style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                            <div className="form-group">
                                <InputLabel shrink>*Email</InputLabel>
                                <BootstrapInput
                                    {...formik.getFieldProps('email')}
                                    error={formik.touched.email && !!formik.errors.email}
                                    type="email"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="error-text">{formik.errors.email}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <InputLabel shrink>*Telephone</InputLabel>
                                <BootstrapInput
                                    {...formik.getFieldProps('contactNo')}
                                    error={formik.touched.contactNo && !!formik.errors.contactNo}
                                />
                                {formik.touched.contactNo && formik.errors.contactNo && (
                                    <div className="error-text">{formik.errors.contactNo}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <InputLabel shrink>WhatsApp</InputLabel>
                                <BootstrapInput
                                    {...formik.getFieldProps('whatsApp')}
                                />
                            </div>



                        </div>
                    </div>

                    <div className="form-group-container">
                        <p>Additional Files</p>
                        <div className="name">
                            <div className="form-group">
                                <InputLabel shrink>*Attach your CV</InputLabel>
                                <BootstrapInput
                                    type="file"
                                    onChange={handleResumeChange}
                                    error={formik.touched.resume && !!formik.errors.resume}
                                />
                                {formik.touched.resume && formik.errors.resume && (
                                    <div className="error-text">{formik.errors.resume}</div>
                                )}
                            </div>

                            <div className="form-group" style={{flexDirection: "column"}}>
                                <InputLabel shrink>*Attach your Photograph</InputLabel>
                                <BootstrapInput type="file" onChange={handleImageChange}
                                                error={formik.touched.profileImage && !!formik.errors.profileImage}
                                />
                                {formik.touched.profileImage && formik.errors.profileImage && (
                                    <div className="error-text">{formik.errors.profileImage}</div>
                                )}
                                {profileImagePreview && !formik.errors.profileImage &&(
                                    <div style={{
                                        marginTop: 10,
                                        border: "1px solid #bfbfbf",
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        overflow: 'hidden',
                                    }}>
                                        <img src={profileImagePreview} alt="Profile"
                                             style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group-container">
                        <p>Course Details</p>
                        <div className="form-group">
                            <InputLabel shrink>*Course Type:</InputLabel>
                            <RadioGroup

                                name="courseType"
                                value={formik.values.courseType}
                                onChange={handleCourseTypeChange}
                            >
                                <FormControlLabel value="primary" control={<Radio sx={{
                                    color: '#fe5e15',
                                    '&.Mui-checked': {color: '#FF5733'}
                                }}/>} label="Creative Activities for Children Programme (CAC-Prog)
"/>
                                <FormControlLabel value="secondary" control={<Radio sx={{
                                    color: '#fe5e15',
                                    '&.Mui-checked': {color: '#FF5733'}
                                }}/>} label="Drama Beyond the Classroom (Grade 7 to GCE O/L students / Drama Practicals )
"/>
                                <FormControlLabel value="ordinary" control={<Radio sx={{
                                    color: '#fe5e15',
                                    '&.Mui-checked': {color: '#FF5733'}
                                }}/>} label="Certificate in Acting Programme"/>
                            </RadioGroup>
                            {formik.touched.courseType && formik.errors.courseType && (
                                <div className="error-text">{formik.errors.courseType}</div>
                            )}
                        </div>

                        {showGuardianFields && (
                            <>
                                <div className="form-group">
                                    <InputLabel shrink>*Guardian Name</InputLabel>
                                    <BootstrapInput
                                        {...formik.getFieldProps('guardianName')}
                                        error={formik.touched.guardianName && !!formik.errors.guardianName}
                                    />
                                    {formik.touched.guardianName && formik.errors.guardianName && (
                                        <div className="error-text">{formik.errors.guardianName}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <InputLabel shrink>*Guardian Relationship</InputLabel>
                                    <BootstrapInput
                                        {...formik.getFieldProps('guardianRelationship')}
                                        error={formik.touched.guardianRelationship && !!formik.errors.guardianRelationship}
                                    />
                                    {formik.touched.guardianRelationship && formik.errors.guardianRelationship && (
                                        <div className="error-text">{formik.errors.guardianRelationship}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <InputLabel shrink>*Guardian Contact No</InputLabel>
                                    <BootstrapInput
                                        {...formik.getFieldProps('guardianContactNo')}
                                        error={formik.touched.guardianContactNo && !!formik.errors.guardianContactNo}
                                    />
                                    {formik.touched.guardianContactNo && formik.errors.guardianContactNo && (
                                        <div className="error-text">{formik.errors.guardianContactNo}</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{width: "50%"}}>
                        <Button
                            variant="contained"
                            type="submit"
                            style={{backgroundColor:"#fe5e15", textTransform: "none", width: "100%",
                                fontSize: "16px", fontWeight: "600"
                        }}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupForm;
