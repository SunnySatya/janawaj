import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaChevronLeft,
  FaReply,
} from "react-icons/fa";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/contact?page=${page}&limit=20`);
      setContacts(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const viewContact = async (contact) => {
    setSelectedContact(contact);
    if (!contact.isRead) {
      try {
        const res = await axios.get(`/api/contact/${contact._id}`);
        setSelectedContact(res.data.data);
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, isRead: true } : c)),
        );
      } catch (err) {
        console.error("Failed to fetch contact details", err);
      }
    }
  };

  const toggleRead = async (id) => {
    try {
      const res = await axios.put(`/api/contact/${id}/toggle-read`);
      setContacts((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isRead: res.data.data.isRead } : c,
        ),
      );
      if (selectedContact?._id === id) {
        setSelectedContact(res.data.data);
      }
    } catch (err) {
      alert("Failed to toggle read status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await axios.delete(`/api/contact/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (selectedContact?._id === id) setSelectedContact(null);
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return `${mins} min${mins !== 1 ? "s" : ""} ago`;
      }
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (selectedContact) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedContact(null)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span>Back to Messages</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedContact.subject}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">
                      {selectedContact.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedContact.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedContact.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRead(selectedContact._id)}
                  className={`p-2 rounded-lg ${
                    selectedContact.isRead
                      ? "text-yellow-600 hover:bg-yellow-50"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                  title={
                    selectedContact.isRead ? "Mark as unread" : "Mark as read"
                  }
                >
                  {selectedContact.isRead ? (
                    <FaEnvelope className="w-4 h-4" />
                  ) : (
                    <FaEnvelopeOpen className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedContact._id);
                    setSelectedContact(null);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Received {formatDate(selectedContact.createdAt)}
            </p>
          </div>

          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedContact.message}
            </p>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Reply to{" "}
              <a
                href={`mailto:${selectedContact.email}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {selectedContact.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage contact form submissions
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages by name, email or subject..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredContacts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                {search
                  ? "No messages matching your search"
                  : "No messages yet"}
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => viewContact(contact)}
                  className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer hover:shadow-md transition-all ${
                    contact.isRead
                      ? "border-gray-200"
                      : "border-primary-200 bg-primary-50/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {!contact.isRead && (
                          <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                        )}
                        <h3
                          className={`text-sm ${
                            contact.isRead
                              ? "font-medium text-gray-900"
                              : "font-semibold text-gray-900"
                          } truncate`}
                        >
                          {contact.subject}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-600">{contact.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{contact.email}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {contact.message}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(contact.createdAt)}
                      </span>
                      <div
                        className="flex items-center space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            if (!contact.isRead) {
                              toggleRead(contact._id);
                            }
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminContacts;
