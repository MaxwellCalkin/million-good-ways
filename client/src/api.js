const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const request = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Unexpected error.';
    try {
      const errorBody = await response.json();
      message = errorBody.error || errorBody.errors?.join(', ') || message;
    } catch {
      // ignore JSON parsing errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchPosts = async ({ sort = 'hot', search = '', mood = '' } = {}) => {
  const params = new URLSearchParams();
  if (sort) params.append('sort', sort);
  if (search) params.append('search', search);
  if (mood) params.append('mood', mood);
  const query = params.toString();
  return request(`/posts${query ? `?${query}` : ''}`);
};

export const fetchPostById = async (id) => request(`/posts/${id}`);

export const createPost = async (payload) => request('/posts', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const voteOnPost = async (id, direction) => request(`/posts/${id}/vote`, {
  method: 'POST',
  body: JSON.stringify({ direction }),
});

export const createComment = async (postId, payload) => request(`/posts/${postId}/comments`, {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const voteOnComment = async (commentId, direction) => request(`/comments/${commentId}/vote`, {
  method: 'POST',
  body: JSON.stringify({ direction }),
});
