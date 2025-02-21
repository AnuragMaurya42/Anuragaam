import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    profilePicture: null, // Changed key to match backend
    bio: user?.bio || '',
    gender: user?.gender || '',
  });

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const editProfileHandler = async (e) => {
    e.preventDefault();
    console.log('Submitting form with input:', input);
    setLoading(true);

    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePicture) {
      formData.append('profilePicture', input.profilePicture); // Key matches the backend
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/profile/edit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        console.log('Profile updated successfully!');
      } else {
        console.log('Error updating profile:', res.data.message);
      }
    } catch (error) {
      console.log('Error updating profile:', error);
      if (error.response && error.response.data) {
        console.log('Server response:', error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Profile</h1>
      <form onSubmit={editProfileHandler}>
        {/* Profile Photo */}
        <div style={{ marginBottom: '20px' }}>
          <label>Profile Picture</label>
          <div>
            {input.profilePicture ? (
              <img
                src={URL.createObjectURL(input.profilePicture)}
                alt="Profile Preview"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            ) : user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Current Profile"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            name="profilePicture" // Name matches backend
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button type="button" onClick={() => fileInputRef.current.click()}>
            Change Photo
          </button>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={input.bio}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%' }}
          ></textarea>
        </div>

        {/* Gender */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={input.gender}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'right' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
