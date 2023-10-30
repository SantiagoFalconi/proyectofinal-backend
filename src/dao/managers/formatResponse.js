const formatResponse = (paginate, options, baseUrl, status) => {
    const { docs, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = paginate
    const { limit, sort } = options

    if(status === 'success'){
        let prevLink;
        let nextLink;
        !hasPrevPage ? prevLink = null : prevLink = `${baseUrl}/${limit}/${prevPage}/${sort}`
        !hasNextPage ? nextLink = null : nextLink = `${baseUrl}/${limit}/${nextPage}/${sort}`
        
        const formatResponse = {
            status:'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        } 
        return formatResponse  
    }

    if (status === 'error'){
        const formatResponse = {
            status: 'error',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            error: error.message
        }
        return formatResponse  
    }
}

export default formatResponse;