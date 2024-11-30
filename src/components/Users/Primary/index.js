import React, { useEffect, useState } from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon from MUI
import { Tabs, Tab, Box } from '@mui/material';

import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const Primary = ({users,downloadFile,updateUserStatus,deleteUser,fetchData}) => {
    // const [users, setUsers] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [currentTab, setCurrentTab] = useState(0);


    const [selectedUser, setSelectedUser] = useState(null); // State for the selected user
    const [open, setOpen] = useState(false); // State to control modal visibility

    // Function to handle row click
    const handleRowClick = (user) => {
        setSelectedUser(user); // Set the clicked user as selected
        setOpen(true); // Open the modal
    };

    // Function to close the modal
    const handleClose = () => {
        setOpen(false);
    };

    const exportToCSV = () => {
        if (users.length === 0) {
            alert("No user data available to export.");
            return;
        }

        // CSV header
        const headers = ["ID", "Email", "First Name","Last Name","Contact No","WhatsApp","Gender","Course Type","Guardian Name","Guardian Relationship","Guardian Contact No","Profile Image","Resume"];

        // Convert data rows into CSV format
        const rows = users.map(user => [user.id, user.email, user.first_name, user.last_name,user.contact_no,user.whatsapp_no,user.gender,user.course_type,user.guardian_name,user.guardian_relationship,user.guardian_contact_no,user.profile_image,user.resume]);

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



    return (
        <div className="users-page" style={{padding: "20px", height: "100vh", background: "#e5e5e5"}}>
            <div style={{ display: "flex", justifyContent:"space-between", alignItems:"center"}}>
                <h1>Registered Students</h1>

                <div>
                    <IconButton onClick={fetchData} aria-label="refresh">
                        <RefreshIcon />
                    </IconButton>
                    <button onClick={exportToCSV} style={{
                        marginBottom: '20px',
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',marginLeft:"10px"
                    }}>
                        Export to CSV
                    </button>
                </div>

            </div>

                <table className="users-table" style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                    <tr>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}></th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Image</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Full Name</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Gender</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>DOB</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>

                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Telephone</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>WhatsApp</th>

                        {/*<th style={{border: '1px solid #ddd', padding: '8px'}}>Course Type</th>*/}
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Guardian Name</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Guardian Relationship</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Guardian Contact No</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Resume</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}></th>

                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{cursor: 'pointer'}}>
                            <td style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>
                                <input
                                    type="checkbox"
                                    checked={user.is_checked}
                                    onChange={() => updateUserStatus(user.id, user.is_checked)}
                                />
                            </td>
                            <td style={{
                                borderLeft: '1px solid #ddd',
                                borderBottom: '1px solid #ddd',
                                padding: '8px',
                                display: "flex",
                                justifyContent: "center"
                            }} onClick={() => handleRowClick(user)}><img
                                src={user.profile_image}
                                alt="Profile"
                                style={{width: '40px', height: '40px', borderRadius: '50%'}}
                            /></td>
                            <td style={{
                                border: '1px solid #ddd',
                                padding: '8px'
                            }} onClick={() => handleRowClick(user)}>{user.first_name} {user.last_name}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}
                                onClick={() => handleRowClick(user)}>{user.gender}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}
                                onClick={() => handleRowClick(user)}>{user.dob}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}
                                onClick={() => handleRowClick(user)}>{user.email}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}
                                onClick={() => handleRowClick(user)}>{user.contact_no}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}
                                onClick={() => handleRowClick(user)}>{user.whatsapp_no}</td>


                            {/*<td style={{border: '1px solid #ddd', padding: '8px'}}*/}
                            {/*    onClick={() => handleRowClick(user)}>{user.course_type}</td>*/}
                            <td style={{border: '1px solid #ddd', padding: '8px'}} onClick={() => handleRowClick(user)}>{user.guardian_name}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}} onClick={() => handleRowClick(user)}>{user.guardian_relationship}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}} onClick={() => handleRowClick(user)}>{user.guardian_contact_no}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{user.resume ? (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                    justifyContent: "center"
                                }}>


                                    <button style={{
                                        padding: '5px 15px',
                                        backgroundColor: '#e82030',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                            onClick={() => downloadFile(user.resume, user.first_name + ' ' + user.last_name + '_resume.pdf')}

                                    >
                                        Download
                                    </button>


                                    <a href={user.resume} target="_blank" rel="noopener noreferrer"
                                       style={{textDecoration: 'none'}}>
                                        <button style={{
                                            padding: '5px 15px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}>
                                            View
                                        </button>

                                    </a>


                                </div>
                            ) : (
                                'N/A'
                            )}</td>

                            <td style={{border: '1px solid #ddd', padding: '8px',textAlign: 'center'}}  >
                                <DeleteIcon
                                    onClick={() => deleteUser(user.id)}
                                    style={{cursor: 'pointer', color: 'black'}}
                                />
                            </td>


                        </tr>
                    ))}
                    </tbody>
                </table>



            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <img
                                    src={selectedUser.profile_image}
                                    alt="Profile"
                                    style={{width: '50px', height: '50px', borderRadius: '50%'}}
                                />
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "20px",
                                padding: "20px"
                            }}>
                                <p><strong>ID:</strong></p><p>{selectedUser.id}</p>
                                <p><strong>Full Name:</strong></p>
                                <p>{selectedUser.first_name} {selectedUser.last_name}</p>
                                <p><strong>Gender:</strong></p><p>{selectedUser.gender}</p>
                                <p><strong>DOB:</strong></p><p>{selectedUser.dob}</p>
                                <p><strong>Email:</strong></p><p>{selectedUser.email}</p>
                                <p><strong>Telephone:</strong></p><p>{selectedUser.contact_no}</p>
                                <p><strong>WhatsApp:</strong></p><p>{selectedUser.whatsapp_no}</p>
                                <p><strong>Course Type:</strong></p><p> {selectedUser.course_type}</p>
                                <p><strong>Guardian Name:</strong></p><p>{selectedUser.guardian_name}</p>
                                <p><strong>Guardian Relationship:</strong></p>
                                <p>{selectedUser.guardian_relationship}</p>
                                <p><strong>Guardian Contact No:</strong></p><p>{selectedUser.guardian_contact_no}</p>


                                <p><strong>Resume:</strong></p>
                                <p>{selectedUser.resume ? (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "10px",
                                        justifyContent: "center"
                                    }}>


                                        <button style={{
                                            padding: '5px 15px',
                                            backgroundColor: '#e82030',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                                onClick={() => downloadFile(selectedUser.resume, 'resume.pdf')}

                                        >
                                            Download
                                        </button>


                                        <a href={selectedUser.resume} target="_blank" rel="noopener noreferrer"
                                           style={{textDecoration: 'none'}}>
                                            <button style={{
                                                padding: '5px 15px',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}>
                                                View
                                            </button>

                                        </a>


                                    </div>
                                ) : (
                                    'N/A'
                                )}</p>


                                {/* Add more details here if available */}
                            </div>
                        </>

                    )}
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} style={{
                        padding: '5px 15px',
                        backgroundColor: '#e82030',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Close
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Primary;
