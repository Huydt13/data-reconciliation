import httpClient from 'app/utils/http-client';
import apiLinks from 'app/utils/api-links';

import types from './types';

const selectChain = (selected) => ({
  type: types.SELECT_CHAIN,
  payload: selected,
});
const selectContact = (selected) => ({
  type: types.SELECT_CONTACT,
  payload: selected,
});

const getChainsRequest = () => ({ type: types.GET_CHAINS_REQUEST });
const getChainsSuccess = (response) => ({
  type: types.GET_CHAINS_SUCCESS,
  payload: response,
});
const getChainsFailure = () => ({ type: types.GET_CHAINS_FAILURE });

const getChains =
  ({
    profileId,
    pageIndex = 0,
    pageSize = 10,
    name,
    diseaseTypeId,
    chainType,
    fromTime,
    toTime,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getChainsRequest());
      httpClient
        .callApi({
          url: apiLinks.infectionChain.chains.get,
          params: {
            profileId,
            pageIndex,
            pageSize,
            chainName: name,
            diseaseTypeId,
            chainType,
            fromTime,
            toTime,
          },
        })
        .then((response) => {
          dispatch(getChainsSuccess(response.data));
          resolve(response.data);
        })
        .catch(() => {
          dispatch(getChainsFailure());
          reject();
        });
    });

const getChainDetailRequest = () => ({ type: types.GET_CHAIN_DETAIL_REQUEST });
const getChainDetailSuccess = (response) => ({
  type: types.GET_CHAIN_DETAIL_SUCCESS,
  payload: response,
});
const getChainDetailFailure = () => ({ type: types.GET_CHAIN_DETAIL_FAILURE });

const getChainDetail = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getChainDetailRequest());
    httpClient
      .callApi({
        url: `${apiLinks.infectionChain.chains.getDetail}${id}`,
      })
      .then((response) => {
        dispatch(getChainDetailSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getChainDetailFailure());
        reject();
      });
  });

const getChainSubjectsRequest = () => ({
  type: types.GET_CHAIN_SUBJECTS_REQUEST,
});
const getChainSubjectsSuccess = (response) => ({
  type: types.GET_CHAIN_SUBJECTS_SUCCESS,
  payload: response,
});
const getChainSubjectsFailure = () => ({
  type: types.GET_CHAIN_SUBJECTS_FAILURE,
});

const getChainSubjects =
  ({ chainId, pageSize, pageIndex }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getChainSubjectsRequest());
      httpClient
        .callApi({
          url: `${apiLinks.infectionChain.chains.getSubjects}${chainId}/Subjects`,
          params: {
            pageSize,
            pageIndex,
          },
        })
        .then((response) => {
          dispatch(getChainSubjectsSuccess(response.data));
          resolve(response.data);
        })
        .catch(() => {
          dispatch(getChainSubjectsFailure());
          reject();
        });
    });

const getContactsByChainRequest = () => ({
  type: types.GET_CONTACTS_BY_CHAIN_REQUEST,
});
const getContactsByChainSuccess = (response) => ({
  type: types.GET_CONTACTS_BY_CHAIN_SUCCESS,
  payload: response,
});
const getContactsByChainFailure = () => ({
  type: types.GET_CONTACTS_BY_CHAIN_FAILURE,
});

const getContactsByChain =
  ({ chainId = 0, pageIndex = 0, pageSize = 0 }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getContactsByChainRequest());
      httpClient
        .callApi({
          url: `${apiLinks.infectionChain.contacts.getContactsByChain}/${chainId}/Contacts`,
          params: { pageIndex, pageSize },
        })
        .then((response) => {
          dispatch(getContactsByChainSuccess(response.data));
          resolve(response.data);
        })
        .catch(() => {
          dispatch(getContactsByChainFailure());
          reject();
        });
    });

const getContactsBySubject = ({
  getContactsAsSubjectFrom = null,
  subjectId = '',
  pageIndex = 0,
  pageSize = 10,
}) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: `${apiLinks.infectionChain.contacts.getContactsBySubject}/${subjectId}/Contacts`,
        params: { getContactsAsSubjectFrom, pageIndex, pageSize },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject();
      });
  });

const getContactsBySubjectRequest = () => ({
  type: types.GET_CONTACTS_BY_SUBJECT_REQUEST,
});
const getContactsBySubjectSuccess = (response) => ({
  type: types.GET_CONTACTS_BY_SUBJECT_SUCCESS,
  payload: response,
});
const getContactsBySubjectFailure = () => ({
  type: types.GET_CONTACTS_BY_SUBJECT_FAILURE,
});

const getContactsBySubjectWithDispatch =
  ({
    getContactsAsSubjectFrom = null,
    subjectId = '',
    pageIndex = 0,
    pageSize = 10,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getContactsBySubjectRequest());
      httpClient
        .callApi({
          url: `${apiLinks.infectionChain.contacts.getContactsBySubject}/${subjectId}/Contacts`,
          params: { getContactsAsSubjectFrom, pageIndex, pageSize },
        })
        .then(({ data }) => {
          dispatch(
            getContactsBySubjectSuccess({
              isFromContact: getContactsAsSubjectFrom,
              data,
            }),
          );
          resolve();
        })
        .catch(() => {
          dispatch(getContactsBySubjectFailure());
          reject();
        });
    });

const createContactRequest = () => ({
  type: types.CREATE_CONTACT_ON_CHAIN_REQUEST,
});
const createContactSuccess = (response) => ({
  type: types.CREATE_CONTACT_ON_CHAIN_SUCCESS,
  payload: response,
});
const createContactFailure = () => ({
  type: types.CREATE_CONTACT_ON_CHAIN_FAILURE,
});

const createContact = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { chainId } = data;
    dispatch(createContactRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: `${apiLinks.infectionChain.chains.createContact}/${chainId}/Contacts`,
        data,
      })
      .then((response) => {
        dispatch(createContactSuccess(response.data));
        resolve();
      })
      .catch((error) => {
        dispatch(createContactFailure());
        reject(error.response.data);
      });
  });

const checkPositiveRequest = () => ({
  type: types.CHECK_POSITIVE_REQUEST,
});
const checkPositiveSuccess = (response) => ({
  type: types.CHECK_POSITIVE_SUCCESS,
  payload: response,
});
const checkPositiveFailure = () => ({
  type: types.CHECK_POSITIVE_FAILURE,
});

const checkPositive =
  ({ profileId, diseaseTypeId }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(checkPositiveRequest());
      httpClient
        .callApi({
          method: 'POST',
          url: apiLinks.infectionChain.subjects.checkPositive,
          params: { diseaseTypeId },
          data: [profileId],
        })
        .then((response) => {
          dispatch(checkPositiveSuccess(response.data));
          resolve();
        })
        .catch(() => {
          dispatch(checkPositiveFailure());
          reject();
        });
    });

const updateInvestigationRequest = () => ({
  type: types.UPDATE_INVESTIGATION_REQUEST,
});
const updateInvestigationSuccess = (response) => ({
  type: types.UPDATE_INVESTIGATION_SUCCESS,
  payload: response,
});
const updateInvestigationFailure = () => ({
  type: types.UPDATE_INVESTIGATION_FAILURE,
});

const updateInvestigation = (data, contactId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateInvestigationRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.infectionChain.contacts.updateInvestigation,
        params: { contactId, investigationId: data.id },
        data,
      })
      .then((response) => {
        dispatch(updateInvestigationSuccess(response.data));
        resolve();
      })
      .catch(() => {
        dispatch(updateInvestigationFailure());
        reject();
      });
  });

const updateInvestigationWithoutDispatch = (data, contactId) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.infectionChain.contacts.updateInvestigation,
        params: { contactId, investigationId: data.id },
        data,
      })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });

const createChainRequest = () => ({ type: types.CREATE_CHAIN_REQUEST });
const createChainSuccess = (response) => ({
  type: types.CREATE_CHAIN_SUCCESS,
  payload: response,
});
const createChainFailure = () => ({ type: types.CREATE_CHAIN_FAILURE });

const createChain = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { profileId: profile } = data;
    dispatch(createChainRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.infectionChain.chains.create,
        data,
        params: { profile },
      })
      .then((response) => {
        dispatch(createChainSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(createChainFailure());
        reject();
      });
  });

const updateChainRequest = () => ({ type: types.UPDATE_CHAIN_REQUEST });
const updateChainSuccess = (response) => ({
  type: types.UPDATE_CHAIN_SUCCESS,
  payload: response,
});
const updateChainFailure = () => ({ type: types.UPDATE_CHAIN_FAILURE });

const updateChain = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(updateChainRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: apiLinks.infectionChain.chains.update + data.id,
        data,
      })
      .then((response) => {
        dispatch(updateChainSuccess(response.data));
        resolve();
      })
      .catch(() => {
        dispatch(updateChainFailure());
        reject();
      });
  });

const deleteChainRequest = () => ({ type: types.DELETE_CHAIN_REQUEST });
const deleteChainSuccess = (response) => ({
  type: types.DELETE_CHAIN_SUCCESS,
  payload: response,
});
const deleteChainFailure = () => ({ type: types.DELETE_CHAIN_FAILURE });

const deleteChain = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(deleteChainRequest());
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.infectionChain.chains.delete + id,
      })
      .then((response) => {
        dispatch(deleteChainSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(deleteChainFailure());
        reject();
      });
  });

const deleteContact = (id) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'DELETE',
        url: apiLinks.infectionChain.contacts.deleteContact + id,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });

const getContactsRequest = () => ({ type: types.GET_CONTACTS_REQUEST });
const getContactsSuccess = (response) => ({
  type: types.GET_CONTACTS_SUCCESS,
  payload: response,
});
const getContactsFailure = () => ({ type: types.GET_CONTACTS_FAILURE });

const getContacts = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getContactsRequest());
    httpClient
      .callApi({
        url: `${apiLinks.infectionChain.contacts.getContactsBySubject}/${id}/Contacts`,
      })
      .then((response) => {
        dispatch(getContactsSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(getContactsFailure());
        reject();
      });
  });

const addContactRequest = () => ({ type: types.ADD_CONTACT_REQUEST });
const addContactSuccess = (response) => ({
  type: types.ADD_CONTACT_SUCCESS,
  payload: response,
});
const addContactFailure = () => ({ type: types.ADD_CONTACT_FAILURE });

const addContact = (data) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addContactRequest());
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.infectionChain.chains.addContact,
        data,
      })
      .then((response) => {
        dispatch(addContactSuccess(response.data));
        resolve(response.data);
      })
      .catch(() => {
        dispatch(addContactFailure());
        reject();
      });
  });

const addSubjects = (data) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'POST',
        url: apiLinks.infectionChain.contacts.addSubjects,
        data,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });
const deleteSubject = (contactId, subjectIds) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        method: 'DELETE',
        url: `${apiLinks.infectionChain.contacts.deleteSubject}/${contactId}/Subjects`,
        data: subjectIds,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });

const getContactDetail = (id) =>
  new Promise((resolve, reject) => {
    httpClient
      .callApi({
        url: apiLinks.infectionChain.contacts.getContactDetail + id,
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject();
      });
  });

const getSubjectDetailRequest = () => ({
  type: types.GET_SUBJECT_DETAIL_REQUEST,
});
const getSubjectDetailSuccess = (response) => ({
  type: types.GET_SUBJECT_DETAIL_SUCCESS,
  payload: response,
});
const getSubjectDetailFailure = () => ({
  type: types.GET_SUBJECT_DETAIL_FAILURE,
});

const getSubjectDetail = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSubjectDetailRequest());
    httpClient
      .callApi({
        url: apiLinks.infectionChain.subjects.getSubjectDetail + id,
      })
      .then(({ data }) => {
        dispatch(getSubjectDetailSuccess(data));
        resolve(data);
      })
      .catch(() => {
        dispatch(getSubjectDetailFailure());
        reject();
      });
  });

const getSubjectFromChainAndProfile = (chainId, profileId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getSubjectDetailRequest());
    httpClient
      .callApi({
        url: `${apiLinks.infectionChain.chains.get}/${chainId}/Profiles/${profileId}/Subject`,
      })
      .then(({ data }) => {
        dispatch(getSubjectDetailSuccess(data));
        resolve(data);
      })
      .catch(() => {
        dispatch(getSubjectDetailFailure());
        reject();
      });
  });

const concludeContactRequest = () => ({
  type: types.CONCLUDE_CONTACT_REQUEST,
});
const concludeContactSuccess = (response) => ({
  type: types.CONCLUDE_CONTACT_SUCCESS,
  payload: response,
});
const concludeContactFailure = () => ({
  type: types.CONCLUDE_CONTACT_FAILURE,
});

const concludeContact = (contactId, subjectId, infectionTypeId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(concludeContactRequest());
    httpClient
      .callApi({
        method: 'PUT',
        url: `${apiLinks.infectionChain.contacts.conclude}${contactId}/Subject/${subjectId}/ConcludeInvestigation`,
        data: { infectionTypeId },
      })
      .then(({ data }) => {
        dispatch(concludeContactSuccess(data));
        resolve(data);
      })
      .catch(() => {
        dispatch(concludeContactFailure());
        reject();
      });
  });

const exportContactsByChainRequest = () => ({
  type: types.EXPORT_CONTACTS_BY_CHAIN_REQUEST,
});
const exportContactsByChainSuccess = (response) => ({
  type: types.EXPORT_CONTACTS_BY_CHAIN_SUCCESS,
  payload: response,
});
const exportContactsByChainFailure = (error) => ({
  type: types.EXPORT_CONTACTS_BY_CHAIN_FAILURE,
  payload: error,
});

const exportContactsByChain = (chainId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(exportContactsByChainRequest());
    httpClient
      .callApi({
        url: `${apiLinks.infectionChain.contacts.exportContactsByChain}${chainId}/Contacts/Export`,
        responseType: 'blob',
      })
      .then((response) => {
        dispatch(exportContactsByChainSuccess(response.data));
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.xlsx');
        document.body.appendChild(link);
        link.click();
        resolve();
      })
      .catch((error) => {
        dispatch(exportContactsByChainFailure(error));
        reject();
      });
  });

export {
  selectChain,
  selectContact,
  getChains,
  getChainDetail,
  getChainSubjects,
  getContactsBySubject,
  getContactsByChain,
  getContactDetail,
  createChain,
  updateChain,
  deleteChain,
  addContact,
  addSubjects,
  deleteSubject,
  getContacts,
  createContact,
  checkPositive,
  updateInvestigation,
  updateInvestigationWithoutDispatch,
  getSubjectDetail,
  concludeContact,
  getSubjectFromChainAndProfile,
  getContactsBySubjectWithDispatch,
  deleteContact,
  exportContactsByChain,
};
