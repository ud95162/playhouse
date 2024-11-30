import React, { useEffect, useState } from 'react';
import {supabase} from "../supabaseClient";
import { Tabs, Tab, Box } from '@mui/material';
import Primary from "./Primary";
import Other from "./Other";


const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);


    // const [selectedUser, setSelectedUser] = useState(null); // State for the selected user
    // const [open, setOpen] = useState(false); // State to control modal visibility


    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at',{ascending:'false'})
        ;

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    // Fetch users from Supabase users table
    useEffect(() => {

        fetchUsers();
    }, []);


    // Function to export table data as CSV
    const exportToCSV = () => {
        if (users.length === 0) {
            alert("No user data available to export.");
            return;
        }

        // CSV header
        const headers = ["ID", "Email", "First Name","Last Name","Contact No","Gender","Course Type","Guardian Name","Guardian Relationship","Guardian Contact No","Profile Image","Resume"];

        // Convert data rows into CSV format
        const rows = users.map(user => [user.id, user.email, user.first_name, user.last_name,user.contact_no,user.gender,user.course_type,user.guardian_name,user.guardian_relationship,user.guardian_contact_no,user.profile_image,user.resume]);

        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\n"; // Add headers row
        rows.forEach(row => {
            csvContent += row.join(",") + "\n"; // Add each row
        });

        // Encode URI and create a download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Function to handle row click
    // const handleRowClick = (user) => {
    //     setSelectedUser(user); // Set the clicked user as selected
    //     setOpen(true); // Open the modal
    // };

    // Function to close the modal
    // const handleClose = () => {
    //     setOpen(false);
    // };


    const downloadFile = (url, filename) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error('There was an error with the download:', error));
    };



    // Function to update checkbox status in Supabase
    const updateUserStatus = async (userId, currentStatus) => {
        console.log(userId);
        console.log(currentStatus)
        const { data, error } = await supabase
            .from('users')
            .update({ is_checked: !currentStatus }) // Toggle status
            .eq('id', userId);

        if (error) {
            console.error('Error updating user status:', error);
        } else {
            setUsers(users.map(user =>
                user.id === userId ? { ...user, is_checked: !currentStatus } : user
            ));
        }
    };


    // Function to delete a user record
    const deleteUser = async (userId) => {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
        } else {
            // Update state to remove the deleted user from the list
            setUsers(users.filter(user => user.id !== userId));
        }
    };
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const filterUsersByCourseType = (courseType) => {
        return users.filter((user) => user.course_type === courseType);
    };

    return (
        <div className="users-page" style={{padding: "20px", height: "100vh", background: "#e5e5e5"}}>

            <Box sx={{ borderBottom: 1, borderColor: 'divider',width: '100%' }}>
                <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth"       // This makes the tabs full-width
                      textColor="primary"
                      indicatorColor="primary">
                    <Tab label=" Creative Activities for Children Programme (CAC - Prog)" />
                    <Tab label=" Drama Beyond the Classroom Grade 4 to O/L students" />
                    <Tab label="Certificate in acting" />
                </Tabs>
            </Box>



            <div style={{ display: "flex", justifyContent:"space-between", alignItems:"center"}}>

            </div>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <>
                    {currentTab === 0 &&
                        <Primary users={filterUsersByCourseType('primary')} fetchData={fetchUsers} deleteUser={deleteUser} updateUserStatus={updateUserStatus} downloadFile={downloadFile} />
                    }
                    {currentTab === 1 &&
                        <Other users={filterUsersByCourseType('secondary')} fetchData={fetchUsers} deleteUser={deleteUser} updateUserStatus={updateUserStatus} downloadFile={downloadFile} />
                    }

                    {currentTab === 2 &&
                        <Other users={filterUsersByCourseType('ordinary')} fetchData={fetchUsers} deleteUser={deleteUser} updateUserStatus={updateUserStatus} downloadFile={downloadFile} />
                    }
                </>
                // <table className="users-table" style={{width: '100%', borderCollapse: 'collapse'}}>
                //     <thead>
                //     <tr>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}></th>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Profile Image</th>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Full Name</th>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Gender</th>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>DOB</th>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                //
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Contact No</th>
                //
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Course Type</th>
                //         {/*<th style={{border: '1px solid #ddd', padding: '8px'}}>Guardian Name</th>*/}
                //         {/*<th style={{border: '1px solid #ddd', padding: '8px'}}>Guardian Relationship</th>*/}
                //         {/*<th style={{border: '1px solid #ddd', padding: '8px'}}>Guardian Contact No</th>*/}
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}>Resume</th>
                //         <th style={{border: '1px solid #ddd', padding: '8px'}}></th>
                //
                //     </tr>
                //     </thead>
                //     <tbody>
                //     {users.map((user) => (
                //         <tr key={user.id} style={{cursor: 'pointer'}}>
                //             <td style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>
                //                 <input
                //                     type="checkbox"
                //                     checked={user.is_checked}
                //                     onChange={() => updateUserStatus(user.id, user.is_checked)}
                //                 />
                //             </td>
                //             <td style={{
                //                 borderLeft: '1px solid #ddd',
                //                 borderBottom: '1px solid #ddd',
                //                 padding: '8px',
                //                 display: "flex",
                //                 justifyContent: "center"
                //             }} onClick={() => handleRowClick(user)}><img
                //                 src={user.profile_image}
                //                 alt="Profile"
                //                 style={{width: '40px', height: '40px', borderRadius: '50%'}}
                //             /></td>
                //             <td style={{
                //                 border: '1px solid #ddd',
                //                 padding: '8px'
                //             }} onClick={() => handleRowClick(user)}>{user.first_name} {user.last_name}</td>
                //             <td style={{border: '1px solid #ddd', padding: '8px'}}
                //                 onClick={() => handleRowClick(user)}>{user.gender}</td>
                //             <td style={{border: '1px solid #ddd', padding: '8px'}}
                //                 onClick={() => handleRowClick(user)}>{user.dob}</td>
                //             <td style={{border: '1px solid #ddd', padding: '8px'}}
                //                 onClick={() => handleRowClick(user)}>{user.email}</td>
                //             <td style={{border: '1px solid #ddd', padding: '8px'}}
                //                 onClick={() => handleRowClick(user)}>{user.contact_no}</td>
                //
                //             <td style={{border: '1px solid #ddd', padding: '8px'}}
                //                 onClick={() => handleRowClick(user)}>{user.course_type}</td>
                //             {/*<td style={{border: '1px solid #ddd', padding: '8px'}} onClick={() => handleRowClick(user)}>{user.guardian_name}</td>*/}
                //             {/*<td style={{border: '1px solid #ddd', padding: '8px'}} onClick={() => handleRowClick(user)}>{user.guardian_relationship}</td>*/}
                //             {/*<td style={{border: '1px solid #ddd', padding: '8px'}} onClick={() => handleRowClick(user)}>{user.guardian_contact_no}</td>*/}
                //             <td style={{border: '1px solid #ddd', padding: '8px'}}>{user.resume ? (
                //                 <div style={{
                //                     display: "flex",
                //                     flexDirection: "row",
                //                     gap: "10px",
                //                     justifyContent: "center"
                //                 }}>
                //
                //
                //                     <button style={{
                //                         padding: '5px 15px',
                //                         backgroundColor: '#e82030',
                //                         color: 'white',
                //                         border: 'none',
                //                         borderRadius: '5px',
                //                         cursor: 'pointer'
                //                     }}
                //                             onClick={() => downloadFile(user.resume, user.first_name + ' ' + user.last_name + '_resume.pdf')}
                //
                //                     >
                //                         Download
                //                     </button>
                //
                //
                //                     <a href={user.resume} target="_blank" rel="noopener noreferrer"
                //                        style={{textDecoration: 'none'}}>
                //                         <button style={{
                //                             padding: '5px 15px',
                //                             backgroundColor: '#4CAF50',
                //                             color: 'white',
                //                             border: 'none',
                //                             borderRadius: '5px',
                //                             cursor: 'pointer'
                //                         }}>
                //                             View
                //                         </button>
                //
                //                     </a>
                //
                //
                //                 </div>
                //             ) : (
                //                 'N/A'
                //             )}</td>
                //
                //             <td style={{border: '1px solid #ddd', padding: '8px',textAlign: 'center'}}  >
                //                 <DeleteIcon
                //                     onClick={() => deleteUser(user.id)}
                //                     style={{cursor: 'pointer', color: 'black'}}
                //                 />
                //             </td>
                //
                //
                //         </tr>
                //     ))}
                //     </tbody>
                // </table>
            )}


            {/*<Dialog open={open} onClose={handleClose}>*/}
            {/*    <DialogTitle>User Details</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        {selectedUser && (*/}
            {/*            <>*/}
            {/*            <div style={{display: 'flex', justifyContent: 'center'}}>*/}
            {/*                    <img*/}
            {/*                        src={selectedUser.profile_image}*/}
            {/*                        alt="Profile"*/}
            {/*                        style={{width: '50px', height: '50px', borderRadius: '50%'}}*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*                <div style={{*/}
            {/*                    display: "grid",*/}
            {/*                    gridTemplateColumns: "repeat(2, 1fr)",*/}
            {/*                    gap: "20px",*/}
            {/*                    padding: "20px"*/}
            {/*                }}>*/}
            {/*                    <p><strong>ID:</strong></p><p>{selectedUser.id}</p>*/}
            {/*                    <p><strong>Full Name:</strong></p>*/}
            {/*                    <p>{selectedUser.first_name} {selectedUser.last_name}</p>*/}
            {/*                    <p><strong>Gender:</strong></p><p>{selectedUser.gender}</p>*/}
            {/*                    <p><strong>DOB:</strong></p><p>{selectedUser.dob}</p>*/}
            {/*                    <p><strong>Email:</strong></p><p>{selectedUser.email}</p>*/}
            {/*                    <p><strong>Contact No:</strong></p><p>{selectedUser.contact_no}</p>*/}
            {/*                    <p><strong>Course Type:</strong></p><p> {selectedUser.course_type}</p>*/}
            {/*                    <p><strong>Guardian Name:</strong></p><p>{selectedUser.guardian_name}</p>*/}
            {/*                    <p><strong>Guardian Relationship:</strong></p>*/}
            {/*                    <p>{selectedUser.guardian_relationship}</p>*/}
            {/*                    <p><strong>Guardian Contact No:</strong></p><p>{selectedUser.guardian_contact_no}</p>*/}


            {/*                    <p><strong>Resume:</strong></p>*/}
            {/*                    <p>{selectedUser.resume ? (*/}
            {/*                        <div style={{*/}
            {/*                            display: "flex",*/}
            {/*                            flexDirection: "row",*/}
            {/*                            gap: "10px",*/}
            {/*                            justifyContent: "center"*/}
            {/*                        }}>*/}


            {/*                            <button style={{*/}
            {/*                                padding: '5px 15px',*/}
            {/*                                backgroundColor: '#e82030',*/}
            {/*                                color: 'white',*/}
            {/*                                border: 'none',*/}
            {/*                                borderRadius: '5px',*/}
            {/*                                cursor: 'pointer'*/}
            {/*                            }}*/}
            {/*                                    onClick={() => downloadFile(selectedUser.resume, 'resume.pdf')}*/}

            {/*                            >*/}
            {/*                                Download*/}
            {/*                            </button>*/}


            {/*                            <a href={selectedUser.resume} target="_blank" rel="noopener noreferrer"*/}
            {/*                               style={{textDecoration: 'none'}}>*/}
            {/*                                <button style={{*/}
            {/*                                    padding: '5px 15px',*/}
            {/*                                    backgroundColor: '#4CAF50',*/}
            {/*                                    color: 'white',*/}
            {/*                                    border: 'none',*/}
            {/*                                    borderRadius: '5px',*/}
            {/*                                    cursor: 'pointer'*/}
            {/*                                }}>*/}
            {/*                                    View*/}
            {/*                                </button>*/}

            {/*                            </a>*/}


            {/*                        </div>*/}
            {/*                    ) : (*/}
            {/*                        'N/A'*/}
            {/*                    )}</p>*/}


            {/*                    /!* Add more details here if available *!/*/}
            {/*                </div>*/}
            {/*            </>*/}

            {/*        )}*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <button onClick={handleClose} style={{*/}
            {/*            padding: '5px 15px',*/}
            {/*            backgroundColor: '#e82030',*/}
            {/*            color: 'white',*/}
            {/*            border: 'none',*/}
            {/*            borderRadius: '5px',*/}
            {/*            cursor: 'pointer'*/}
            {/*        }}>*/}
            {/*            Close*/}
            {/*        </button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </div>
    );
};

export default Users;
