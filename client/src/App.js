import logo from './logo.svg';
import './App.css';
import NavBar from './comp/NabBar/NavBar';

import { FaHome, FaInfo, FaServicestack, FaPhone, FaBlog } from "react-icons/fa";
import SideBar from './comp/SideBar/SideBar';
import { useEffect, useState } from 'react';
import axios from 'axios';

const items = ['Home', 'About', 'Services', 'Contact', 'Blog'];
const icons = [<FaHome size={24} />, <FaInfo size={24} />, <FaServicestack size={24} />, <FaPhone size={24} />, <FaBlog size={24} />];

function App() {
  
  const [selectedItem, setSelectedItem] = useState('');
  const [emails, setEmails] = useState([]);

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000'); // Adjust URL as per your server setup
      setEmails(response?.data)
      console.log(response);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="App">
      <NavBar />
      <SideBar items={items} icons={icons} onSelect={handleSelect} selectedItem={selectedItem} />
      <div className='content'>
        {selectedItem ?
          (
            <div className="main__body">
              <div className="emailList">
                {/* Section Ends */}
                {/* Email List rows starts */}
                <div className="emailList__list">
                  {emails?.map((email) => {
                    return (
                      <div className="emailRow">
                        <div className="emailRow__options">
                          <input type="checkbox" name="" id="" />
                          <span className="material-icons"> star_border </span>
                          <span className="material-icons"> label_important </span>
                        </div>
                        <h3 className="emailRow__title">{email?.sender_name}</h3>
                        <div className="emailRow__message">
                          <h4>
                            <span className="emailRow__description">
                              {email?.subject}
                            </span>
                          </h4>
                        </div>
                        <p className="emailRow__time">{new Date(email?.date).toLocaleDateString()}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : <h1>Welcome! Select an item from the sidebar.</h1>}
      </div>
    </div>
  );
}

export default App;
