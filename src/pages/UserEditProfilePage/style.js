import { styled } from "styled-components";

export const WrapperUserEditProfile = styled.div`

    .edit-input-email, 
    .edit-input-password, 
    .edit-input-fullname,
    .edit-input-phone,
    .edit-input-address,
    .edit-input-avatar {
        height: 45px;
        border-radius: 12px;
        padding: 0px 18px; 
        margin-top: 20px; 
        border: 1px solid #000;
    }

    .edit-input-fullname .ant-input, 
    .edit-input-email .ant-input, 
    .edit-input-password .ant-input,
    .edit-input-phone .ant-input,
    .edit-input-address .ant-input,
    .edit-input-avatar .ant-input {
        padding-top: 7px;
    }

    .edit-button-save, .edit-button-cancel {
        height: 50px; 
        width: 100%; 
        border-radius: 12px; 
        margin: 20px 0px;

    }
`

export const WrapperUploadUserAvatar = styled.div`
    .ant-upload-list.ant-upload-list-text {
        display: none;
    }

    img.edit-uploaded-user-avatar {
        border-radius: 50%;
        height: 90px;
        width: 90px;
        object-fit: cover;
        margin: 20px;
    }

    .edit-default-avatar {
        height: 90px;
        margin: 20px;
    }

    .edit-avatar-remove-button {
        width: 98px;
        margin-left: 15px;
    }
`