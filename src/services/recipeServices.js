import api from "./api/axiosInstance"

const getRecipes = async () => {
  try {
    const data = await api.get('/recipes')
    return data.data
  } catch (err) {
    throw new Error('gagal mengambil data:', err.message)
  }
}

const getRecipesById = async (id) => {
  try {
    const data = await api.get(`/recipes/${id}`)
    return data.data
  }catch (err) {
    throw new Error('gagal mengambil data:', err.message)
  }
}

const searchRecipes = async(query) => {
  try {
    const data = await api.get('/recipes/search', {
      params: {
      q: query
    }})
    return data.data
  }catch (err) {
    throw new Error('gagal mengambil data:', err.message)
  }
}

const getRecipeTags = async () => {
  const response = await api.get("/recipes/tags")
  return response.data
}

const getRecipesByTag = async (tag) => {
  const response = await api.get(`/recipes/tag/${tag}`)
  return response.data
}

export {getRecipes, getRecipesById, searchRecipes, getRecipeTags, getRecipesByTag}